/**
 * ルートの設定オプション
 */
export type RouteConfig = {
  /**
   * クエリパラメータの型名
   * @default 'Query'
   */
  queryTypeName?: string;

  /**
   * 数字で始まるページコンポーネントの命名規則
   * @default 'underscore'
   */
  numberFileConvention?: "underscore" | "custom";

  /**
   * カスタム命名規則を使用する場合の変換ルール
   */
  customNumberFileName?: string;

  /**
   * 生成された型の出力先
   * @default 'node_modules'
   */
  outputDir?: string;
};

/**
 * フレームワーク固有の設定
 */
export type FrameworkConfig = {
  // ルーティングの判定ロジック
  ignoreRoute: (segment: string) => boolean;
  isDynamicRoute: (segment: string) => boolean;
  isPage: (segment: string) => boolean;

  // オプション
  pageFilePattern: string; // 例: "page.{tsx,ts}"
  dynamicRoutePattern: string; // 例: "[id]"
};

export type GenerateRoutesOptions = {
  targetDir: string;
  outputPath: string;
  config: FrameworkConfig;
};

export type RouteSegment = {
  original: string; // 元のファイル名/ディレクトリ名
  parsed: string; // パース後のパス名
  isPage: boolean; // ページかどうか
  isDynamic: boolean; // 動的パラメータかどうか
  paramName: string; // パラメータ名（動的な場合）
  parentSegment?: string; // 親セグメントのパス
};
