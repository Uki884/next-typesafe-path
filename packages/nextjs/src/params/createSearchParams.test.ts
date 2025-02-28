import { describe, it, expect } from 'vitest'
import { createSearchParams } from './createSearchParams'
import { z } from 'zod'

describe('createSearchParams', () => {
  it('should create a schema with default values', () => {
    const schema = createSearchParams(p => ({
      q: p.query(p.string(), ""),
      page: p.query(p.number(), 1),
    }))
    
    // スキーマの型チェック
    expect(schema).toBeInstanceOf(z.ZodObject)
    
    // 型推論のテスト
    type Schema = z.infer<typeof schema>
    const test: Schema = { q: 'test', page: 2 }
    expect(test).toBeDefined()
  })
  
  it('should support coerce transformations', () => {
    const schema = createSearchParams(p => ({
      page: p.query(
        p.coerce.number().int().positive(),
        1
      ),
    }))
    
    // スキーマの型チェック
    expect(schema).toBeInstanceOf(z.ZodObject)
    
    // zodのパースを使って検証
    const result = schema.safeParse({ page: '5' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(5)
    }
  })
  
  it('should use fallback value for invalid input', () => {
    const schema = createSearchParams(p => ({
      page: p.query(
        p.coerce.number().int().positive(),
        1
      ),
    }))
    
    // 不正な値の場合はフォールバック値が使われる
    const result = schema.safeParse({ page: 'invalid' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
    }
  })
  
  it('should support enum', () => {
    const schema = createSearchParams(p => ({
      sort: p.query(p.enum(["asc", "desc"] as const), "asc"),
    }))
    
    // スキーマの型チェック
    expect(schema).toBeInstanceOf(z.ZodObject)
    
    // 型推論のテスト
    type Schema = z.infer<typeof schema>
    const test: Schema = { sort: 'desc' }
    expect(test).toBeDefined()
    
    // 不正な値はコンパイルエラーになる（型チェックのみ）
    // @ts-expect-error
    const invalid: Schema = { sort: 'invalid' }
    
    // 不正な値の場合はフォールバック値が使われる
    const result = schema.safeParse({ sort: 'invalid' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sort).toBe('asc')
    }
  })
  
  it('should support complex schemas', () => {
    const schema = createSearchParams(p => ({
      q: p.query(p.string(), ""),
      page: p.query(
        p.coerce.number().int().positive(),
        1
      ),
      sort: p.query(p.enum(["asc", "desc"] as const), "asc"),
      category: p.query(
        p.enum(["electronics", "books", "games"] as const),
        "electronics"
      ),
      tags: p.query(
        p.array(p.string()),
        []
      ),
    }))
    
    // スキーマの型チェック
    expect(schema).toBeInstanceOf(z.ZodObject)
    
    // 型推論のテスト
    type Schema = z.infer<typeof schema>
    const test: Schema = { 
      q: 'test', 
      page: 2, 
      sort: 'desc',
      category: 'books',
      tags: ['fiction', 'mystery']
    }
    expect(test).toBeDefined()
  })
  
  it('should parse input correctly with coercion', () => {
    const schema = createSearchParams(p => ({
      q: p.query(p.string(), ""),
      page: p.query(
        p.coerce.number().int().positive(),
        1
      ),
      sort: p.query(p.enum(["asc", "desc"] as const), "asc"),
      inStock: p.query(p.coerce.boolean(), true)
    }))
    
    const result = schema.safeParse({
      q: 'search',
      page: '2',
      sort: 'desc',
      inStock: 'true'
    })
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        q: 'search',
        page: 2,
        sort: 'desc',
        inStock: true
      })
    }
  })
  
  it('should handle invalid input with fallback values', () => {
    const schema = createSearchParams(p => ({
      q: p.query(p.string(), "default"),
      page: p.query(
        p.coerce.number().int().positive(),
        1
      ),
      sort: p.query(p.enum(["asc", "desc"] as const), "asc"),
    }))
    
    const result = schema.safeParse({
      q: 123, // 不正な型
      page: 'invalid', // 数値に変換できない
      sort: 'invalid' // enumに存在しない
    })
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        q: "default",
        page: 1,
        sort: "asc"
      })
    }
  })
}) 