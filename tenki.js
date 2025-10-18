// ========================================
// 設定モジュール
// ========================================
const CONFIG = {
  CUSTOM_PROJECTS_SHEET_NAME: "個別案件設定",
  STORE_NAME_MASTER_SHEET_NAME: "店舗名称マスター",

  SHEETS: {
    SHIFT: "シフト",
    RESOURCE: "リソース",
    MASTER: "マスター",
    STORE: "店舗別",
    ID_MANAGEMENT: "ID管理",
  },

  SHIFT_COLUMNS: {
    NAME: 1,
    NICKNAME: 2,
    DATE_ROW: 1,
    DAY_OF_WEEK_ROW: 2,
    DATA_START: 9,
    NAME_START_ROW: 3,
  },

  PERSONAL_ROWS: {
    DATE: 2,
    DAY_OF_WEEK: 3,
    PROJECT: 4,
    VENUE: 5,
    CONTENT: 6,
    HOURS: 7,
    STAFF: 8,
    NOTES: 9,
    START_COL: 2,
  },

  MASTER_COLUMNS: {
    CHECKBOX: 1,      // A列: チェックボックス
    NAME: 2,          // B列: 名前
    SHEET_ID: 3,      // C列: スプレッドシートID
    LAST_UPDATE: 4,   // D列: 最終更新日
    ERROR_MESSAGE: 5, // E列: エラー
    TOTAL_COLUMNS: 5,
  },

  MASTER_SETTINGS: {
    FOLDER_ID_LABEL_ROW: 1,
    FOLDER_ID_LABEL_COL: 7,  // G1
    FOLDER_ID_ROW: 2,
    FOLDER_ID_COL: 7,         // G2

    // プルダウン設定
    MONTH_DROPDOWN_LABEL_ROW: 4,  // G4
    MONTH_DROPDOWN_LABEL_COL: 7,
    MONTH_DROPDOWN_ROW: 5,         // G5
    MONTH_DROPDOWN_COL: 7,

    HEADER_ROW: 1,
    DATA_START_ROW: 2,
    USAGE_START_ROW: 7,  // カレンダー削除により位置変更
  },

  ID_MANAGEMENT: {
    NAME_COL: 1,      // A列: 名前
    SHEET_ID_COL: 2,  // B列: スプレッドシートID
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
    USAGE_START_COL: 4,  // D列: 使い方
    USAGE_START_ROW: 2,
    WARNING_COLOR: "#FF9900",  // オレンジ色
    TOTAL_COLUMNS: 2,
  },

  STORE_NAME_MASTER: {
    ABBREVIATED_NAME_COL: 1,  // A列: 略称
    OFFICIAL_NAME_COL: 2,     // B列: 正式名称
    REMARKS_COL: 3,           // C列: 備考
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
  },

  STORE_CONFIG: {
    NAME_COL: 2,
    DATE_ROW: 1,
    DATA_START_ROW: 3,
    DATA_START_COL: 4,
  },

  HOLIDAYS_2025: [
    "1/1", "1/13", "2/11", "2/23", "2/24", "3/20", "4/29",
    "5/3", "5/4", "5/5", "5/6", "7/21", "8/11", "9/15",
    "9/22", "9/23", "10/13", "11/3", "11/23", "11/24",
  ],

  PROJECT_COLORS: {
    希望休: "#FFFF00",
    公休: "#FFFF00",
    病欠: "#FF0000",
    シフト体験: "#FFFF00",
    人間ドック: "#FFFF00",
    座学: "#B4E7CE",
    OJT: "#FFD9B3",
  },

  // 特殊な案件名
  SPECIAL_PROJECTS: {
    ZAKUGAKU: "座学",
    OJT: "OJT",
    KIBOU_YASUMI: "希望休",
    KOUKYUU: "公休",
    SANKAKU: "△",
  },

  // 会場デフォルト
  DEFAULT_VENUES: {
    ZAKUGAKU: "東船橋事務所",
  },

  // 内容デフォルト
  DEFAULT_CONTENTS: {
    ZAKUGAKU: "研修",
    NOKISAKI: "軒先販売",
    TENTOU_HELPER: "店頭ヘルパー",
    SHUCCHOU_HANBAI: "出張販売",
  },

  // システムメッセージ
  SYSTEM_MESSAGES: {
    NEED_TIME_CONFIRMATION: "要時間確認",
    NEED_TRAINER_CONFIRMATION: "トレーナーに確認してください",
    OJT_LABEL: "OJT",
  },

  // 色設定
  COLORS: {
    HEADER_BG: "#E8F0FE",
    FOLDER_ID_BG: "#FFF2CC",
    SATURDAY_BG: "#CCE5FF",
    SUNDAY_HOLIDAY_BG: "#FFE5E5",
    HOLIDAY_TEXT: "#FF0000",
    BORDER: "#DADCE0",
    WHITE: "#FFFFFF",
  },

  // 列幅設定
  COLUMN_WIDTHS: {
    MASTER_CHECKBOX: 60,
    MASTER_NAME: 150,
    MASTER_SHEET_ID: 400,
    MASTER_LAST_UPDATE: 150,
    MASTER_ERROR: 300,
    MONTH_DROPDOWN: 150,  // プルダウン用の列幅
    PERSONAL_DATE_COL: 100,
    PERSONAL_HEADER_COL: 150,
  },

  // その他定数
  MAX_PREVIEW_COUNT: 10,
  MAX_ERROR_DISPLAY: 5,
  YEAR_RANGE_START: 2025,
  YEAR_RANGE_END: 2030,
  RESOURCE_START_ROW: 2,
  RESOURCE_TOTAL_COLS: 6,
};

// ========================================
// 設定管理マネージャー (PropertiesService統合)
// ========================================
/**
 * ConfigManager - 環境別設定と外部設定管理
 *
 * PropertiesServiceを使用して実行時設定を管理します。
 * 開発/本番環境の切り替え、デバッグモード、外部設定の上書きが可能です。
 *
 * @example
 * // デバッグモードを有効化
 * ConfigManager.set('DEBUG_MODE', 'true');
 *
 * // 環境を本番に設定
 * ConfigManager.set('ENVIRONMENT', 'production');
 *
 * // 設定値を取得
 * const isDebug = ConfigManager.isDebugMode(); // true/false
 */
const ConfigManager = {
  /**
   * スクリプトプロパティから設定値を取得
   * @param {string} key - 設定キー
   * @param {*} defaultValue - デフォルト値
   * @returns {string|null} 設定値
   */
  get(key, defaultValue = null) {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      const value = scriptProps.getProperty(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      Logger.log(`[ConfigManager] 設定取得エラー (key: ${key}): ${error.message}`);
      return defaultValue;
    }
  },

  /**
   * スクリプトプロパティに設定値を保存
   * @param {string} key - 設定キー
   * @param {string} value - 設定値
   * @returns {boolean} 成功/失敗
   */
  set(key, value) {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      scriptProps.setProperty(key, String(value));
      Logger.log(`[ConfigManager] 設定保存成功 (key: ${key}, value: ${value})`);
      return true;
    } catch (error) {
      Logger.log(`[ConfigManager] 設定保存エラー (key: ${key}): ${error.message}`);
      return false;
    }
  },

  /**
   * 複数の設定値を一括保存
   * @param {Object} keyValuePairs - キーと値のペアのオブジェクト
   * @returns {boolean} 成功/失敗
   */
  setMultiple(keyValuePairs) {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      const stringifiedPairs = {};
      for (const key in keyValuePairs) {
        stringifiedPairs[key] = String(keyValuePairs[key]);
      }
      scriptProps.setProperties(stringifiedPairs);
      Logger.log(`[ConfigManager] 一括設定保存成功 (${Object.keys(keyValuePairs).length}件)`);
      return true;
    } catch (error) {
      Logger.log(`[ConfigManager] 一括設定保存エラー: ${error.message}`);
      return false;
    }
  },

  /**
   * 設定値を削除
   * @param {string} key - 設定キー
   * @returns {boolean} 成功/失敗
   */
  delete(key) {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      scriptProps.deleteProperty(key);
      Logger.log(`[ConfigManager] 設定削除成功 (key: ${key})`);
      return true;
    } catch (error) {
      Logger.log(`[ConfigManager] 設定削除エラー (key: ${key}): ${error.message}`);
      return false;
    }
  },

  /**
   * すべての設定値を取得
   * @returns {Object} すべての設定値
   */
  getAll() {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      return scriptProps.getProperties();
    } catch (error) {
      Logger.log(`[ConfigManager] 全設定取得エラー: ${error.message}`);
      return {};
    }
  },

  /**
   * 現在の環境を取得 (development/production)
   * @returns {string} 環境名
   */
  getEnvironment() {
    return this.get('ENVIRONMENT', 'production');
  },

  /**
   * 本番環境かどうかを判定
   * @returns {boolean} 本番環境ならtrue
   */
  isProduction() {
    return this.getEnvironment() === 'production';
  },

  /**
   * 開発環境かどうかを判定
   * @returns {boolean} 開発環境ならtrue
   */
  isDevelopment() {
    return this.getEnvironment() === 'development';
  },

  /**
   * デバッグモードが有効かどうかを判定
   * @returns {boolean} デバッグモードならtrue
   */
  isDebugMode() {
    return this.get('DEBUG_MODE', 'false') === 'true';
  },

  /**
   * デバッグモードを設定
   * @param {boolean} enabled - 有効/無効
   * @returns {boolean} 成功/失敗
   */
  setDebugMode(enabled) {
    return this.set('DEBUG_MODE', enabled ? 'true' : 'false');
  },

  /**
   * 詳細ログモードが有効かどうかを判定
   * @returns {boolean} 詳細ログモードならtrue
   */
  isVerboseLogging() {
    return this.get('VERBOSE_LOGGING', 'false') === 'true';
  },

  /**
   * CONFIG値を上書き取得（PropertiesServiceの値を優先）
   * @param {string} configPath - CONFIG内のパス (例: "COLORS.HEADER_BG")
   * @returns {*} 設定値
   */
  getConfigValue(configPath) {
    // PropertiesServiceに上書き設定があるかチェック
    const overrideKey = `CONFIG_OVERRIDE_${configPath.replace(/\./g, '_')}`;
    const override = this.get(overrideKey);
    if (override !== null) {
      Logger.log(`[ConfigManager] CONFIG上書き適用: ${configPath} = ${override}`);
      return override;
    }

    // デフォルトのCONFIG値を返す
    const keys = configPath.split('.');
    let value = CONFIG;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  },

  /**
   * CONFIG値の上書き設定
   * @param {string} configPath - CONFIG内のパス
   * @param {*} value - 上書き値
   * @returns {boolean} 成功/失敗
   */
  setConfigOverride(configPath, value) {
    const overrideKey = `CONFIG_OVERRIDE_${configPath.replace(/\./g, '_')}`;
    return this.set(overrideKey, value);
  },

  /**
   * すべての設定をログ出力（デバッグ用）
   */
  logAllSettings() {
    const allSettings = this.getAll();
    Logger.log('=== ConfigManager 全設定 ===');
    Logger.log(`環境: ${this.getEnvironment()}`);
    Logger.log(`デバッグモード: ${this.isDebugMode()}`);
    Logger.log(`詳細ログ: ${this.isVerboseLogging()}`);
    Logger.log('--- PropertiesService ---');
    for (const key in allSettings) {
      Logger.log(`  ${key}: ${allSettings[key]}`);
    }
    Logger.log('========================');
  }
};

// ========================================
// 日付ユーティリティモジュール
// ========================================
/**
 * DateUtils - 日付操作のユーティリティ
 *
 * 日付の変換、判定、フォーマット処理を提供します。
 *
 * @example
 * // 日付範囲を展開
 * const dates = DateUtils.expandDatesFromRange("11/1-3,5"); // [1, 3, 5]
 *
 * // 週末・祝日判定
 * const isHoliday = DateUtils.isWeekendOrHoliday(1, 2025, 11); // true/false
 *
 * // 曜日名を取得
 * const dayName = DateUtils.getDayOfWeekName(2025, 11, 1); // "金"
 */
const DateUtils = {
  /**
   * 日付範囲テキストから日付配列を展開（最適化版）
   *
   * パフォーマンス改善:
   * - Setを使用した重複チェック（O(1)）
   * - 正規表現の事前コンパイル（クラス変数）
   * - 不要な配列操作の削減
   * - 早期リターンの追加
   *
   * @param {string} dateRangeText - 日付範囲テキスト (例: "11/1-3,5,7-9")
   * @returns {number[]} 日付配列（ソート済み、重複なし）
   *
   * @example
   * DateUtils.expandDatesFromRange("11/1-3,5"); // [1, 2, 3, 5]
   * DateUtils.expandDatesFromRange("10/1〜3,6"); // [1, 2, 3, 6]
   * DateUtils.expandDatesFromRange("11/1、3、5"); // [1, 3, 5] (全角カンマ)
   * DateUtils.expandDatesFromRange("10/1-3・5-7"); // [1, 2, 3, 5, 6, 7] (中黒)
   * DateUtils.expandDatesFromRange("11/1"); // [1] (単一日付)
   * DateUtils.expandDatesFromRange("10/"); // [] (不正な形式)
   */
  expandDatesFromRange(dateRangeText) {
    // 早期リターン: 空文字列または不正な形式
    if (!dateRangeText || typeof dateRangeText !== 'string') {
      return [];
    }

    // 月の抽出（早期リターン）
    const monthMatch = dateRangeText.match(/(\d+)\//);
    if (!monthMatch) return [];

    // 月部分を除去（StringUtilsを使用）
    const daysText = StringUtils.extractDaysFromDateRange(dateRangeText);
    if (!daysText) return [];

    // 重複を防ぐためSetを使用（O(1)の追加/検索）
    const dateSet = new Set();

    // 複数の区切り文字で分割（StringUtilsを使用）
    const parts = StringUtils.splitByDateDelimiters(daysText);

    for (let i = 0; i < parts.length; i++) {
      const trimmed = parts[i].trim();
      if (!trimmed) continue;

      // 範囲指定チェック（例: 1-4, 1〜4, 1～4）
      // 正規表現を使わずインデックス検索で高速化
      let rangeIndex = -1;
      const rangeChars = ['-', '〜', '~', '～'];

      for (let j = 0; j < rangeChars.length; j++) {
        const idx = trimmed.indexOf(rangeChars[j]);
        if (idx > 0) {
          rangeIndex = idx;
          break;
        }
      }

      if (rangeIndex > 0) {
        // 範囲指定
        const startStr = trimmed.slice(0, rangeIndex);
        const endStr = trimmed.slice(rangeIndex + 1);

        const startDay = parseInt(startStr, 10);
        const endDay = parseInt(endStr, 10);

        // 数値チェック
        if (!isNaN(startDay) && !isNaN(endDay) && startDay <= endDay) {
          for (let day = startDay; day <= endDay; day++) {
            dateSet.add(day);
          }
        }
      } else {
        // 単一日付
        const day = parseInt(trimmed, 10);
        if (!isNaN(day) && day > 0) {
          dateSet.add(day);
        }
      }
    }

    // Setを配列に変換してソート
    return Array.from(dateSet).sort((a, b) => a - b);
  },

  /**
   * 日付値から日を抽出
   *
   * @param {Date|string} dateValue - 日付値（Dateオブジェクトまたは"M/D"形式の文字列）
   * @returns {number|null} 日（1-31）または null
   *
   * @example
   * DateUtils.extractDay(new Date(2025, 10, 1)); // 1
   * DateUtils.extractDay("11/15"); // 15
   */
  extractDay(dateValue) {
    if (dateValue instanceof Date) {
      return dateValue.getDate();
    }
    if (typeof dateValue === "string") {
      const match = dateValue.match(/(\d+)\/(\d+)/);
      return match ? parseInt(match[2]) : null;
    }
    return null;
  },

  /**
   * 週末または祝日かどうかを判定
   *
   * @param {number} day - 日（1-31）
   * @param {number} year - 年
   * @param {number} month - 月（1-12）
   * @returns {boolean} 週末または祝日ならtrue
   *
   * @example
   * DateUtils.isWeekendOrHoliday(1, 2025, 1); // true (1/1は祝日)
   * DateUtils.isWeekendOrHoliday(15, 2025, 11); // false (平日)
   */
  isWeekendOrHoliday(day, year, month) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dateStr = `${month}/${day}`;
    const isHoliday = CONFIG.HOLIDAYS_2025.indexOf(dateStr) !== -1;
    return dayOfWeek === 0 || dayOfWeek === 6 || isHoliday;
  },

  /**
   * 祝日かどうかを判定（週末を除く）
   *
   * @param {number} day - 日（1-31）
   * @param {number} month - 月（1-12）
   * @returns {boolean} 祝日ならtrue
   *
   * @example
   * DateUtils.isHoliday(1, 1); // true (元日)
   * DateUtils.isHoliday(15, 11); // false
   */
  isHoliday(day, month) {
    const dateStr = `${month}/${day}`;
    return CONFIG.HOLIDAYS_2025.indexOf(dateStr) !== -1;
  },

  /**
   * 曜日名を取得
   *
   * @param {number} year - 年
   * @param {number} month - 月（1-12）
   * @param {number} day - 日（1-31）
   * @returns {string} 曜日名（"日", "月", "火", "水", "木", "金", "土"）
   *
   * @example
   * DateUtils.getDayOfWeekName(2025, 11, 1); // "土"
   */
  getDayOfWeekName(year, month, day) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    return dayNames[dayOfWeek];
  },

  /**
   * 曜日番号を取得（0=日曜, 6=土曜）
   *
   * @param {number} year - 年
   * @param {number} month - 月（1-12）
   * @param {number} day - 日（1-31）
   * @returns {number} 曜日番号（0-6）
   *
   * @example
   * DateUtils.getDayOfWeek(2025, 11, 1); // 6 (土曜)
   */
  getDayOfWeek(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.getDay();
  },

  /**
   * 指定月の日数を取得
   *
   * @param {number} year - 年
   * @param {number} month - 月（1-12）
   * @returns {number} その月の日数（28-31）
   *
   * @example
   * DateUtils.getDaysInMonth(2025, 2); // 28
   * DateUtils.getDaysInMonth(2025, 11); // 30
   */
  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  /**
   * 日付配列と曜日配列を生成
   *
   * @param {number} year - 年
   * @param {number} month - 月（1-12）
   * @returns {{dates: number[], daysOfWeek: string[]}} 日付配列と曜日配列
   *
   * @example
   * const {dates, daysOfWeek} = DateUtils.generateDateArrays(2025, 11);
   * // dates: [1, 2, 3, ..., 30]
   * // daysOfWeek: ["土", "日", "月", ..., "日"]
   */
  generateDateArrays(year, month) {
    const daysInMonth = this.getDaysInMonth(year, month);
    const dates = [];
    const daysOfWeek = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day);
      daysOfWeek.push(this.getDayOfWeekName(year, month, day));
    }

    return { dates, daysOfWeek };
  },

  /**
   * 日付文字列をフォーマット
   *
   * @param {Date} date - Dateオブジェクト
   * @param {string} format - フォーマット文字列（"yyyy/MM/dd", "yyyy/MM/dd HH:mm"など）
   * @returns {string} フォーマット済み日付文字列
   *
   * @example
   * const now = new Date();
   * DateUtils.formatDate(now, "yyyy/MM/dd"); // "2025/11/01"
   * DateUtils.formatDate(now, "yyyy/MM/dd HH:mm"); // "2025/11/01 15:30"
   */
  formatDate(date, format) {
    return Utilities.formatDate(date, "Asia/Tokyo", format);
  },

  /**
   * 現在日時を指定フォーマットで取得
   *
   * @param {string} format - フォーマット文字列（デフォルト: "yyyy/MM/dd HH:mm"）
   * @returns {string} フォーマット済み現在日時
   *
   * @example
   * DateUtils.now(); // "2025/11/01 15:30"
   * DateUtils.now("yyyy/MM/dd"); // "2025/11/01"
   */
  now(format = "yyyy/MM/dd HH:mm") {
    return this.formatDate(new Date(), format);
  }
};

// ========================================
// 文字列ユーティリティモジュール
// ========================================
/**
 * StringUtils - 文字列操作のユーティリティ
 *
 * 文字列の正規化、クリーニング、抽出処理を提供します。
 *
 * @example
 * // 案件名から番号を除去
 * const baseName = StringUtils.extractBaseName("テラス湘南①"); // "テラス湘南"
 *
 * // 時間フォーマットを正規化
 * const time = StringUtils.normalizeTimeFormat("9:00-17:00"); // "9:00〜17:00"
 *
 * // 名前を前処理（括弧内を除去）
 * const name = StringUtils.preprocessName("(退職)山田太郎"); // "山田太郎"
 */
const StringUtils = {
  /**
   * 時間フォーマットを正規化（ハイフンを波ダッシュに変換）
   *
   * @param {string} timeStr - 時間文字列（例: "9:00-17:00"）
   * @returns {string} 正規化された時間文字列（例: "9:00〜17:00"）
   *
   * @example
   * StringUtils.normalizeTimeFormat("9:00-17:00"); // "9:00〜17:00"
   * StringUtils.normalizeTimeFormat("10:00~18:00"); // "10:00〜18:00"
   */
  normalizeTimeFormat(timeStr) {
    if (!timeStr) return "";
    return timeStr.replace(/[\-~～]/g, "〜");
  },

  /**
   * 案件名から番号記号を除去してベース名を取得
   *
   * @param {string} projectName - 案件名（例: "テラス湘南①②"）
   * @returns {string} ベース名（例: "テラス湘南"）
   *
   * @example
   * StringUtils.extractBaseName("テラス湘南①"); // "テラス湘南"
   * StringUtils.extractBaseName("イオンモール②③"); // "イオンモール"
   */
  extractBaseName(projectName) {
    if (!projectName) return "";
    return projectName.replace(/[①②③④⑤⑥⑦⑧⑨⑩]+$/g, "");
  },

  /**
   * 名前を前処理（括弧内の退職情報などを除去）
   *
   * @param {string} name - 名前（例: "(退職)山田太郎"）
   * @returns {string} 処理済み名前（例: "山田太郎"）
   *
   * @example
   * StringUtils.preprocessName("(退職)山田太郎"); // "山田太郎"
   * StringUtils.preprocessName("）鈴木花子"); // "鈴木花子"
   * StringUtils.preprocessName("  佐藤次郎  "); // "佐藤次郎"
   */
  preprocessName(name) {
    if (!name || typeof name !== "string") return "";
    const trimmedName = name.trim();
    if (trimmedName === "") return "";
    // 括弧で始まり括弧で終わる部分（退職情報など）を除去
    const processedName = trimmedName.replace(/^[^）)]*[）)]\s*/, "");
    return processedName.trim();
  },

  /**
   * 内容テキストをクリーニング（会場名・人数などを除去）
   *
   * @param {string} contentText - 内容テキスト（例: "店頭ヘルパー：イオンモール＋3名"）
   * @returns {string} クリーニング済み内容（例: "店頭ヘルパー"）
   *
   * @example
   * StringUtils.cleanContentText("店頭ヘルパー：イオン"); // "店頭ヘルパー"
   * StringUtils.cleanContentText("軒先販売＋場所代 12名"); // "軒先販売"
   */
  cleanContentText(contentText) {
    if (!contentText) return "";

    // 会場名以降を除去（会場名は別途取得するため）
    const cleaned = contentText
      .split(/[：:]/)[0]  // 最初のコロンまで
      .replace(/＋[^：:（）()]*$/, '')  // 末尾の「＋〜」を除去
      .replace(/\s*\d+名.*$/, '')  // 「12名」などを除去
      .trim();

    return cleaned;
  },

  /**
   * 会場名テキストをクリーニング（追加情報を除去）
   *
   * @param {string} venueText - 会場テキスト
   * @returns {string} クリーニング済み会場名
   *
   * @example
   * StringUtils.cleanVenueText("イオンモール：2階"); // "イオンモール"
   * StringUtils.cleanVenueText("ベイシア＋駐車場"); // "ベイシア"
   */
  cleanVenueText(venueText) {
    if (!venueText) return "";

    const cleaned = venueText
      .split(/[：:]/)[0]
      .replace(/＋[^：:（）()]*$/, '')
      .replace(/\s*\d+名.*$/, '')
      .trim();

    return cleaned;
  },

  /**
   * 文字列を指定長さで切り詰め
   *
   * @param {string} str - 対象文字列
   * @param {number} maxLength - 最大長さ
   * @param {string} suffix - 切り詰め時に付加する文字列（デフォルト: "..."）
   * @returns {string} 切り詰め済み文字列
   *
   * @example
   * StringUtils.truncate("長いテキストです", 5); // "長いテキ..."
   * StringUtils.truncate("短い", 10); // "短い"
   */
  truncate(str, maxLength, suffix = "...") {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  },

  /**
   * 文字列が空または空白のみかどうかを判定
   *
   * @param {string} str - 対象文字列
   * @returns {boolean} 空または空白のみならtrue
   *
   * @example
   * StringUtils.isEmpty(""); // true
   * StringUtils.isEmpty("  "); // true
   * StringUtils.isEmpty("text"); // false
   */
  isEmpty(str) {
    return !str || str.trim() === "";
  },

  /**
   * 文字列配列から重複を除去
   *
   * @param {string[]} arr - 文字列配列
   * @returns {string[]} 重複除去済み配列
   *
   * @example
   * StringUtils.unique(["A", "B", "A", "C"]); // ["A", "B", "C"]
   */
  unique(arr) {
    if (!Array.isArray(arr)) return [];
    const seen = {};
    const result = [];
    for (const item of arr) {
      if (item && !seen[item]) {
        seen[item] = true;
        result.push(item);
      }
    }
    return result;
  },

  /**
   * 改行・空白を正規化
   *
   * @param {string} str - 対象文字列
   * @returns {string} 正規化済み文字列
   *
   * @example
   * StringUtils.normalizeWhitespace("複数\n\n改行  と　　空白"); // "複数 改行 と 空白"
   */
  normalizeWhitespace(str) {
    if (!str) return "";
    return str.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  },

  /**
   * 行頭の箇条書き記号を除去
   *
   * @param {string} str - 対象文字列
   * @returns {string} 箇条書き記号を除去した文字列
   *
   * @example
   * StringUtils.removeLeadingBullets("・イオンモール"); // "イオンモール"
   * StringUtils.removeLeadingBullets("•ベイシア"); // "ベイシア"
   */
  removeLeadingBullets(str) {
    if (!str) return "";
    return str.replace(/^[・•]\s*/, '');
  },

  /**
   * 日付範囲文字列から日付部分のみを抽出
   *
   * @param {string} dateRangeText - 日付範囲文字列（例: "11/1-3"）
   * @returns {string} 日付部分（例: "1-3"）、月が含まれていない場合は空文字列
   *
   * @example
   * StringUtils.extractDaysFromDateRange("11/1-3"); // "1-3"
   * StringUtils.extractDaysFromDateRange("12/15,20"); // "15,20"
   * StringUtils.extractDaysFromDateRange("invalid"); // ""
   */
  extractDaysFromDateRange(dateRangeText) {
    if (!dateRangeText || typeof dateRangeText !== 'string') return "";
    const slashIndex = dateRangeText.indexOf('/');
    if (slashIndex === -1) return "";
    return dateRangeText.slice(slashIndex + 1);
  },

  /**
   * 日付区切り文字で文字列を分割
   *
   * @param {string} text - 対象文字列
   * @returns {string[]} 分割された文字列配列
   *
   * @example
   * StringUtils.splitByDateDelimiters("1,2,3"); // ["1", "2", "3"]
   * StringUtils.splitByDateDelimiters("1、2.3・4"); // ["1", "2", "3", "4"]
   */
  splitByDateDelimiters(text) {
    if (!text) return [];
    return text.split(/[,、.・]/);
  },

  /**
   * コロンで分割して最初の部分を取得
   *
   * @param {string} text - 対象文字列
   * @returns {string} コロン前の文字列
   *
   * @example
   * StringUtils.getBeforeColon("店頭ヘルパー：イオン"); // "店頭ヘルパー"
   * StringUtils.getBeforeColon("ベイシア:11/1-3"); // "ベイシア"
   */
  getBeforeColon(text) {
    if (!text) return "";
    return text.split(/[：:]/)[0];
  }
};

// ========================================
// エラーハンドリングモジュール
// ========================================
/**
 * ErrorHandler - 統一的なエラー処理
 *
 * エラーのログ記録、ユーザー通知、リトライ処理を提供します。
 *
 * @example
 * // 基本的なエラーハンドリング
 * ErrorHandler.handle(error, "データ取得");
 *
 * // リトライ付き実行
 * const result = ErrorHandler.retry(() => someOperation(), 3);
 *
 * // 安全な実行（エラー時にデフォルト値を返す）
 * const data = ErrorHandler.safe(() => getData(), []);
 */
const ErrorHandler = {
  /**
   * エラー情報を保存するキャッシュ
   * @private
   */
  _errorCache: [],

  /**
   * エラーの最大保存数
   * @private
   */
  _MAX_ERRORS: 100,

  /**
   * エラーをハンドリング（ログ記録とユーザー通知）
   *
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - エラーが発生したコンテキスト（例: "データ取得"）
   * @param {Object} options - オプション
   * @param {boolean} options.showAlert - ユーザーにアラートを表示するか（デフォルト: false）
   * @param {boolean} options.logStack - スタックトレースをログに記録するか（デフォルト: false）
   * @param {Object} options.metadata - 追加のメタデータ
   *
   * @example
   * try {
   *   // 処理
   * } catch (error) {
   *   ErrorHandler.handle(error, "データ取得", { showAlert: true });
   * }
   */
  handle(error, context = "不明な処理", options = {}) {
    const {
      showAlert = false,
      logStack = false,
      metadata = {}
    } = options;

    const errorInfo = {
      timestamp: DateUtils.now(),
      context,
      message: error.message || String(error),
      stack: error.stack || "",
      metadata
    };

    // エラーをキャッシュに保存
    this._errorCache.push(errorInfo);
    if (this._errorCache.length > this._MAX_ERRORS) {
      this._errorCache.shift();
    }

    // ログに記録
    Logger.log(`[エラー] ${context}: ${errorInfo.message}`);
    if (logStack && errorInfo.stack) {
      Logger.log(`スタックトレース:\n${errorInfo.stack}`);
    }
    if (Object.keys(metadata).length > 0) {
      Logger.log(`メタデータ: ${JSON.stringify(metadata)}`);
    }

    // ユーザーに通知
    if (showAlert) {
      const alertMessage = `${context}中にエラーが発生しました:\n\n${errorInfo.message}`;
      Utils.showAlert("エラー", alertMessage);
    }

    return errorInfo;
  },

  /**
   * 非同期エラーをハンドリング
   *
   * @param {Promise} promise - Promise
   * @param {string} context - コンテキスト
   * @param {Object} options - オプション
   * @returns {Promise<[Error|null, any]>} [エラー, 結果] のタプル
   *
   * @example
   * const [error, data] = await ErrorHandler.handleAsync(fetchData(), "データ取得");
   * if (error) {
   *   // エラー処理
   * }
   */
  async handleAsync(promise, context, options = {}) {
    try {
      const result = await promise;
      return [null, result];
    } catch (error) {
      this.handle(error, context, options);
      return [error, null];
    }
  },

  /**
   * 関数をリトライ付きで実行
   *
   * @param {Function} fn - 実行する関数
   * @param {number} maxRetries - 最大リトライ回数（デフォルト: 3）
   * @param {number} delayMs - リトライ間の遅延ミリ秒（デフォルト: 1000）
   * @param {string} context - コンテキスト
   * @returns {*} 関数の実行結果
   * @throws {Error} すべてのリトライが失敗した場合
   *
   * @example
   * const data = ErrorHandler.retry(
   *   () => SpreadsheetApp.getActiveSpreadsheet(),
   *   3,
   *   1000,
   *   "スプレッドシート取得"
   * );
   */
  retry(fn, maxRetries = 3, delayMs = 1000, context = "処理") {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.log(`[リトライ] ${context} (試行 ${attempt}/${maxRetries})`);
        return fn();
      } catch (error) {
        lastError = error;
        Logger.log(`[リトライ失敗] ${context} (試行 ${attempt}/${maxRetries}): ${error.message}`);

        if (attempt < maxRetries) {
          Logger.log(`${delayMs}ms待機してリトライします...`);
          Utilities.sleep(delayMs);
        }
      }
    }

    // すべてのリトライが失敗
    this.handle(lastError, `${context}（${maxRetries}回リトライ後）`, {
      showAlert: true,
      logStack: true
    });
    throw lastError;
  },

  /**
   * 関数を安全に実行（エラー時にデフォルト値を返す）
   *
   * @param {Function} fn - 実行する関数
   * @param {*} defaultValue - エラー時のデフォルト値
   * @param {string} context - コンテキスト
   * @returns {*} 関数の実行結果またはデフォルト値
   *
   * @example
   * const data = ErrorHandler.safe(
   *   () => JSON.parse(jsonString),
   *   {},
   *   "JSON解析"
   * );
   */
  safe(fn, defaultValue = null, context = "処理") {
    try {
      return fn();
    } catch (error) {
      this.handle(error, context, { showAlert: false, logStack: false });
      return defaultValue;
    }
  },

  /**
   * エラーキャッシュを取得
   *
   * @param {number} limit - 取得する最大件数（デフォルト: 10）
   * @returns {Array} エラー情報の配列
   *
   * @example
   * const recentErrors = ErrorHandler.getErrors(5);
   */
  getErrors(limit = 10) {
    const errors = this._errorCache.slice();
    return errors.slice(-limit).reverse();
  },

  /**
   * エラーキャッシュをクリア
   *
   * @example
   * ErrorHandler.clearErrors();
   */
  clearErrors() {
    this._errorCache = [];
    Logger.log("[ErrorHandler] エラーキャッシュをクリアしました");
  },

  /**
   * エラーレポートを生成
   *
   * @param {number} limit - 含めるエラーの最大件数（デフォルト: 20）
   * @returns {string} エラーレポート（マークダウン形式）
   *
   * @example
   * const report = ErrorHandler.generateReport();
   * Logger.log(report);
   */
  generateReport(limit = 20) {
    const errors = this.getErrors(limit);

    if (errors.length === 0) {
      return "エラーはありません。";
    }

    let report = `# エラーレポート\n\n`;
    report += `総エラー数: ${this._errorCache.length}\n`;
    report += `最新${errors.length}件を表示\n\n`;
    report += `---\n\n`;

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      report += `## エラー ${i + 1}\n\n`;
      report += `- **日時**: ${error.timestamp}\n`;
      report += `- **コンテキスト**: ${error.context}\n`;
      report += `- **メッセージ**: ${error.message}\n`;

      if (Object.keys(error.metadata).length > 0) {
        report += `- **メタデータ**: ${JSON.stringify(error.metadata)}\n`;
      }

      report += `\n`;
    }

    return report;
  },

  /**
   * エラーレポートをログに出力
   *
   * @param {number} limit - 含めるエラーの最大件数（デフォルト: 20）
   *
   * @example
   * ErrorHandler.logReport();
   */
  logReport(limit = 20) {
    const report = this.generateReport(limit);
    Logger.log(report);
  },

  /**
   * デバッグモードが有効な場合のみエラーを詳細ログに記録
   *
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - コンテキスト
   * @param {Object} metadata - メタデータ
   *
   * @example
   * ErrorHandler.debug(error, "データ処理", { userId: 123 });
   */
  debug(error, context = "デバッグ", metadata = {}) {
    if (ConfigManager.isDebugMode()) {
      this.handle(error, `[DEBUG] ${context}`, {
        showAlert: false,
        logStack: true,
        metadata
      });
    }
  },

  /**
   * 致命的なエラーをハンドリング（必ずユーザーに通知）
   *
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - コンテキスト
   * @param {Object} metadata - メタデータ
   *
   * @example
   * ErrorHandler.fatal(error, "データ保存失敗");
   */
  fatal(error, context = "致命的エラー", metadata = {}) {
    this.handle(error, context, {
      showAlert: true,
      logStack: true,
      metadata
    });
  }
};

// ========================================
// 設定管理モジュール
// ========================================
const SettingsManager = {
  getSettings() {
    const masterSheet = this._getMasterSheet();
    const folderId = masterSheet.getRange(CONFIG.MASTER_SETTINGS.FOLDER_ID_ROW, CONFIG.MASTER_SETTINGS.FOLDER_ID_COL).getValue();

    // カレンダーから選択された年月を取得
    const yearMonth = this._getSelectedYearMonth(masterSheet);

    return {
      folderId: folderId || "",
      targetYear: yearMonth.year,
      targetMonth: yearMonth.month,
    };
  },

  _getSelectedYearMonth(sheet) {
    // G5セルからプルダウンの値を取得
    const value = sheet.getRange(
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_ROW,
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_COL
    ).getValue();

    if (!value) {
      // デフォルト値
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1
      };
    }

    // Dateオブジェクトの場合の処理を追加
    if (value instanceof Date) {
      return {
        year: value.getFullYear(),
        month: value.getMonth() + 1
      };
    }

    // 文字列の場合の処理
    const match = String(value).match(/(\d{4})年(\d{1,2})月/);

    if (match) {
      return {
        year: parseInt(match[1]),
        month: parseInt(match[2])
      };
    }

    // デフォルト
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1
    };
  },

  _getMasterSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.MASTER);

    if (!sheet) {
      throw new Error(`「${CONFIG.SHEETS.MASTER}」シートが見つかりません。\n「マスター初期設定」を実行してください。`);
    }

    return sheet;
  },

  findSourceSpreadsheet() {
    const settings = this.getSettings();

    if (!settings.folderId) {
      throw new Error(
        "フォルダIDが設定されていません。\n「マスター」シートのG2セルに設定してください。"
      );
    }

    try {
      const folder = DriveApp.getFolderById(settings.folderId);
      const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);

      const patterns = [
        `${settings.targetYear}年${settings.targetMonth}月`,
        `${settings.targetYear}_${String(settings.targetMonth).padStart(2, "0")}`,
        `${settings.targetYear}-${String(settings.targetMonth).padStart(2, "0")}`,
        `${settings.targetYear}${String(settings.targetMonth).padStart(2, "0")}`,
      ];

      while (files.hasNext()) {
        const file = files.next();
        const fileName = file.getName();

        for (const pattern of patterns) {
          if (fileName.indexOf(pattern) !== -1) {
            Logger.log(`シフト表を発見: ${fileName}`);
            return file.getId();
          }
        }
      }

      throw new Error(
        `${settings.targetYear}年${settings.targetMonth}月のシフト表が見つかりません。\n\n` +
        `フォルダ内のファイル名に以下のいずれかを含めてください:\n` +
        patterns.map(p => `・${p}`).join("\n")
      );
    } catch (e) {
      if (e.message.indexOf("見つかりません") !== -1) {
        throw e;
      }
      throw new Error(
        "フォルダにアクセスできません。\nフォルダIDまたはアクセス権限を確認してください。"
      );
    }
  },
};

// ========================================
// メニュー作成
// ========================================
/**
 * スプレッドシート起動時にメニューを追加
 *
 * @function onOpen
 * @returns {void}
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("📋 シフト転記システム")
    .addItem("✅ チェックした人を転記", "transferCheckedMembers")
    .addSeparator()
    .addItem("📄 マスターシート更新", "updateMasterSheet")
    .addItem("🔄 月プルダウン更新", "updateMonthDropdown")
    .addItem("⚙️ マスター初期設定", "initializeMasterSheet")
    .addSeparator()
    .addSubMenu(ui.createMenu("🔧 システム設定")
      .addItem("🐛 デバッグモード切替", "toggleDebugMode")
      .addItem("📊 詳細ログ切替", "toggleVerboseLogging")
      .addItem("📝 全設定表示", "showAllSettings")
      .addItem("🔄 設定リセット", "resetAllSettings")
      .addSeparator()
      .addItem("⚠️ エラーレポート表示", "showErrorReport")
      .addItem("🗑️ エラーログクリア", "clearErrorLog"))
    .addToUi();
}

/**
 * 月プルダウンを更新（メニューから呼び出し）
 *
 * @function updateMonthDropdown
 * @returns {void}
 */
function updateMonthDropdown() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.MASTER);

    if (!sheet) {
      Utils.showAlert("エラー", "マスターシートが見つかりません");
      return;
    }

    MasterSheetManager._setupMonthDropdown(sheet);

    Utils.showAlert(
      "更新完了",
      "月プルダウンを更新しました。\n今月と来月が選択できます。"
    );
  } catch (error) {
    Logger.log(`月プルダウン更新エラー: ${error.message}`);
    Utils.showAlert("エラー", `更新中にエラーが発生しました:\n${error.message}`);
  }
}

// ========================================
// システム設定メニュー関数
// ========================================

/**
 * デバッグモードを切り替え
 *
 * @function toggleDebugMode
 * @returns {void}
 */
function toggleDebugMode() {
  try {
    const currentMode = ConfigManager.isDebugMode();
    ConfigManager.setDebugMode(!currentMode);
    const newMode = ConfigManager.isDebugMode();

    Utils.showAlert(
      "デバッグモード",
      `デバッグモードを${newMode ? '有効' : '無効'}にしました。\n\n` +
      `現在の状態: ${newMode ? 'ON' : 'OFF'}\n\n` +
      `※ログ出力量が${newMode ? '増加' : '減少'}します。`
    );

    Logger.log(`[システム] デバッグモード変更: ${currentMode} → ${newMode}`);
  } catch (error) {
    Logger.log(`デバッグモード切替エラー: ${error.message}`);
    Utils.showAlert("エラー", `設定変更中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * 詳細ログモードを切り替え
 *
 * @function toggleVerboseLogging
 * @returns {void}
 */
function toggleVerboseLogging() {
  try {
    const currentMode = ConfigManager.isVerboseLogging();
    ConfigManager.set('VERBOSE_LOGGING', currentMode ? 'false' : 'true');
    const newMode = ConfigManager.isVerboseLogging();

    Utils.showAlert(
      "詳細ログモード",
      `詳細ログモードを${newMode ? '有効' : '無効'}にしました。\n\n` +
      `現在の状態: ${newMode ? 'ON' : 'OFF'}\n\n` +
      `※会場・内容抽出処理のログが${newMode ? '詳細表示' : '通常表示'}されます。`
    );

    Logger.log(`[システム] 詳細ログモード変更: ${currentMode} → ${newMode}`);
  } catch (error) {
    Logger.log(`詳細ログ切替エラー: ${error.message}`);
    Utils.showAlert("エラー", `設定変更中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * すべての設定を表示
 *
 * @function showAllSettings
 * @returns {void}
 */
function showAllSettings() {
  try {
    const allSettings = ConfigManager.getAll();
    const environment = ConfigManager.getEnvironment();
    const debugMode = ConfigManager.isDebugMode();
    const verboseLogging = ConfigManager.isVerboseLogging();

    let message = "=== 現在のシステム設定 ===\n\n";
    message += `環境: ${environment}\n`;
    message += `デバッグモード: ${debugMode ? 'ON' : 'OFF'}\n`;
    message += `詳細ログ: ${verboseLogging ? 'ON' : 'OFF'}\n\n`;

    const settingCount = Object.keys(allSettings).length;
    if (settingCount > 0) {
      message += `--- カスタム設定 (${settingCount}件) ---\n`;
      for (const key in allSettings) {
        message += `${key}: ${allSettings[key]}\n`;
      }
    } else {
      message += "カスタム設定なし\n";
    }

    Utils.showAlert("システム設定一覧", message);

    // ログにも出力
    ConfigManager.logAllSettings();
  } catch (error) {
    Logger.log(`全設定表示エラー: ${error.message}`);
    Utils.showAlert("エラー", `設定取得中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * すべての設定をリセット
 *
 * @function resetAllSettings
 * @returns {void}
 */
function resetAllSettings() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      "設定リセット確認",
      "すべてのシステム設定をリセットしますか？\n\n" +
      "この操作により以下の設定が削除されます：\n" +
      "・デバッグモード\n" +
      "・詳細ログモード\n" +
      "・環境設定\n" +
      "・CONFIG上書き設定\n\n" +
      "※この操作は元に戻せません。",
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      Utils.showAlert("キャンセル", "設定リセットをキャンセルしました。");
      return;
    }

    // すべての設定を取得して削除
    const allSettings = ConfigManager.getAll();
    const scriptProps = PropertiesService.getScriptProperties();

    let deletedCount = 0;
    for (const key in allSettings) {
      scriptProps.deleteProperty(key);
      deletedCount++;
    }

    Utils.showAlert(
      "リセット完了",
      `${deletedCount}件の設定を削除しました。\n\n` +
      "すべての設定がデフォルト値に戻りました。"
    );

    Logger.log(`[システム] 設定リセット完了: ${deletedCount}件削除`);
  } catch (error) {
    Logger.log(`設定リセットエラー: ${error.message}`);
    Utils.showAlert("エラー", `リセット中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * エラーレポートを表示
 *
 * @function showErrorReport
 * @returns {void}
 */
function showErrorReport() {
  try {
    const errors = ErrorHandler.getErrors(10);

    if (errors.length === 0) {
      Utils.showAlert(
        "エラーレポート",
        "記録されているエラーはありません。\n\nシステムは正常に動作しています。"
      );
      return;
    }

    let message = `=== 最新のエラー (${errors.length}件) ===\n\n`;

    for (let i = 0; i < Math.min(errors.length, 5); i++) {
      const error = errors[i];
      message += `【エラー ${i + 1}】\n`;
      message += `日時: ${error.timestamp}\n`;
      message += `場所: ${error.context}\n`;
      message += `内容: ${error.message}\n`;
      if (Object.keys(error.metadata).length > 0) {
        message += `詳細: ${JSON.stringify(error.metadata)}\n`;
      }
      message += `\n`;
    }

    if (errors.length > 5) {
      message += `\n... 他${errors.length - 5}件のエラー\n`;
    }

    message += `\n※詳細はログを確認してください`;

    Utils.showAlert("エラーレポート", message);

    // ログにも詳細レポートを出力
    ErrorHandler.logReport(20);
  } catch (error) {
    Logger.log(`エラーレポート表示エラー: ${error.message}`);
    Utils.showAlert("エラー", `レポート生成中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * エラーログをクリア
 *
 * @function clearErrorLog
 * @returns {void}
 */
function clearErrorLog() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      "エラーログクリア確認",
      "すべてのエラーログをクリアしますか？\n\n" +
      "※この操作は元に戻せません。",
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      Utils.showAlert("キャンセル", "エラーログクリアをキャンセルしました。");
      return;
    }

    const errorCount = ErrorHandler.getErrors().length;
    ErrorHandler.clearErrors();

    Utils.showAlert(
      "クリア完了",
      `${errorCount}件のエラーログをクリアしました。`
    );

    Logger.log(`[システム] エラーログクリア完了: ${errorCount}件削除`);
  } catch (error) {
    Logger.log(`エラーログクリアエラー: ${error.message}`);
    Utils.showAlert("エラー", `クリア中にエラーが発生しました:\n${error.message}`);
  }
}

// ========================================
// ユーティリティモジュール
// ========================================
const Utils = {
  showAlert(title, message) {
    SpreadsheetApp.getUi().alert(title, message, SpreadsheetApp.getUi().ButtonSet.OK);
  },

  showPrompt(title, message) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() === ui.Button.OK) {
      return response.getResponseText().trim();
    }
    return null;
  },

  extractDay(dateValue) {
    return DateUtils.extractDay(dateValue);
  },

  isWeekendOrHoliday(day, year, month) {
    return DateUtils.isWeekendOrHoliday(day, year, month);
  },

  normalizeTimeFormat(timeStr) {
    return StringUtils.normalizeTimeFormat(timeStr);
  },

  extractBaseName(projectName) {
    return StringUtils.extractBaseName(projectName);
  },

  preprocessName(name) {
    return StringUtils.preprocessName(name);
  },

  isValidName(name) {
    if (!name || typeof name !== "string") return false;
    const trimmedName = name.trim();
    if (trimmedName === "") return false;
    const namePattern = /^[^\s]+\s+[^\s]+$/;
    return namePattern.test(trimmedName);
  },
};

// ========================================
// データアクセス層
// ========================================
const DataAccess = {
  /**
   * マスターシートを取得する共通関数
   * @private
   * @return {Sheet} マスターシート
   * @throws {Error} シートが見つからない場合
   */
  _getMasterSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MASTER);
    if (!sheet) {
      throw new Error(`「${CONFIG.SHEETS.MASTER}」シートが見つかりません。`);
    }
    return sheet;
  },

  /**
   * マスターシートから全メンバーデータを取得
   * @private
   * @return {Object} {lastRow, names, sheetIds}
   */
  _getAllMasterData() {
    const masterSheet = this._getMasterSheet();
    const lastRow = masterSheet.getLastRow();

    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) {
      return { lastRow: 0, names: [], sheetIds: [] };
    }

    const rowCount = lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1;
    const data = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      rowCount,
      2
    ).getValues();

    const names = [];
    const sheetIds = [];
    for (let i = 0; i < data.length; i++) {
      names.push(data[i][0]);
      sheetIds.push(data[i][1]);
    }

    return { lastRow, names, sheetIds };
  },

  /**
   * 指定メンバーの情報を取得
   * @param {string} name メンバー名
   * @return {Object|null} メンバー情報
   */
  getMemberInfo(name) {
    const masterData = this._getAllMasterData();

    for (let i = 0; i < masterData.names.length; i++) {
      if (masterData.names[i] === name) {
        const settings = SettingsManager.getSettings();
        const targetSheetName = String(settings.targetYear).slice(2) +
                             String(settings.targetMonth).padStart(2, "0");

        return {
          name: masterData.names[i],
          sheetId: masterData.sheetIds[i],
          targetSheetName,
        };
      }
    }
    return null;
  },

  /**
   * チェックされたメンバー一覧を取得
   * @return {Array<string>} メンバー名の配列
   */
  getCheckedMembers() {
    const masterSheet = this._getMasterSheet();
    const lastRow = masterSheet.getLastRow();

    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) return [];

    const rowCount = lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1;
    const checkboxes = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.CHECKBOX,
      rowCount,
      1
    ).getValues();

    const names = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      rowCount,
      1
    ).getValues();

    const checkedMembers = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i][0] === true && names[i][0]) {
        checkedMembers.push(names[i][0]);
      }
    }

    return checkedMembers;
  },

  getPersonalShiftData(name) {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);

    if (!shiftSheet) {
      throw new Error(`「${CONFIG.SHEETS.SHIFT}」シートが見つかりません`);
    }

    const targetRow = this._findNameRow(shiftSheet, name);
    if (!targetRow) {
      Logger.log(`「${name}」が見つかりませんでした`);
      return [];
    }

    return this._extractShiftDataFromRow(shiftSheet, targetRow);
  },

  getOJTData(name) {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);

    if (!shiftSheet) {
      throw new Error(`「${CONFIG.SHEETS.SHIFT}」シートが見つかりません`);
    }

    const targetRow = this._findNameRow(shiftSheet, name);
    if (!targetRow) return [];

    return this._extractOJTDataFromRow(shiftSheet, targetRow, name);
  },

  // 全員のOJTデータを取得（トレーナー側の処理用）
  getAllOJTData() {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);

    if (!shiftSheet) {
      return [];
    }

    const lastRow = shiftSheet.getLastRow();
    const startRow = CONFIG.SHIFT_COLUMNS.NAME_START_ROW;

    if (lastRow < startRow) return [];

    const allOJTData = [];
    const names = shiftSheet.getRange(startRow, CONFIG.SHIFT_COLUMNS.NAME, lastRow - startRow + 1, 1).getValues();

    for (let i = 0; i < names.length; i++) {
      const name = names[i][0];
      if (name && typeof name === "string" && name.trim() !== "") {
        const targetRow = startRow + i;
        const ojtData = this._extractOJTDataFromRow(shiftSheet, targetRow, name);

        for (const item of ojtData) {
          allOJTData.push({
            traineeName: name,
            date: item.date,
            trainerInfo: item.trainerInfo
          });
        }
      }
    }

    return allOJTData;
  },

  _findNameRow(sheet, name) {
    const lastRow = sheet.getLastRow();
    const nameColumn = sheet.getRange(1, CONFIG.SHIFT_COLUMNS.NAME, lastRow, 1).getValues();

    for (let i = 0; i < nameColumn.length; i++) {
      const cellName = nameColumn[i][0];
      if (!cellName) continue;

      // 元シフト表の名前を正規化して比較
      const processedCellName = Utils.preprocessName(cellName);

      if (processedCellName === name) {
        return i + 1;
      }
    }
    return null;
  },
  _extractShiftDataFromRow(sheet, targetRow) {
    const lastCol = sheet.getLastColumn();
    const startCol = CONFIG.SHIFT_COLUMNS.DATA_START;

    const dateHeaders = sheet.getRange(
      CONFIG.SHIFT_COLUMNS.DATE_ROW,
      startCol,
      1,
      lastCol - startCol + 1
    ).getValues()[0];

    const projectData = sheet.getRange(targetRow, startCol, 1, lastCol - startCol + 1).getValues()[0];

    const shiftData = [];
    for (let i = 0; i < dateHeaders.length; i++) {
      const day = Utils.extractDay(dateHeaders[i]);
      if (day) {
        shiftData.push({
          date: day,
          projectName: projectData[i] || "",
          colIndex: startCol + i,
        });
      }
    }

    return shiftData;
  },

  _extractOJTDataFromRow(sheet, targetRow, name) {
    const lastCol = sheet.getLastColumn();
    const startCol = CONFIG.SHIFT_COLUMNS.DATA_START;

    const dateHeaders = sheet.getRange(
      CONFIG.SHIFT_COLUMNS.DATE_ROW,
      startCol,
      1,
      lastCol - startCol + 1
    ).getValues()[0];

    const projectData = sheet.getRange(targetRow, startCol, 1, lastCol - startCol + 1).getValues()[0];

    const ojtData = [];
    for (let i = 0; i < dateHeaders.length; i++) {
      const day = Utils.extractDay(dateHeaders[i]);
      if (day && projectData[i] === "OJT") {
        const colIndex = startCol + i;
        const backgroundColor = sheet.getRange(targetRow, colIndex).getBackground();
        const trainerInfo = this._findTrainerByColor(sheet, backgroundColor, colIndex, name);

        ojtData.push({
          date: day,
          colIndex,
          backgroundColor,
          trainerInfo,
        });
      }
    }

    return ojtData;
  },

  _findTrainerByColor(sheet, targetColor, targetCol, excludeName) {
    const lastRow = sheet.getLastRow();
    const startRow = CONFIG.SHIFT_COLUMNS.NAME_START_ROW;

    const dataRange = sheet.getRange(
      startRow,
      CONFIG.SHIFT_COLUMNS.NAME,
      lastRow - startRow + 1,
      targetCol - CONFIG.SHIFT_COLUMNS.NAME + 1
    );
    const values = dataRange.getValues();
    const backgrounds = dataRange.getBackgrounds();

    for (let i = 0; i < values.length; i++) {
      const name = values[i][0];
      if (!name || name === excludeName) continue;

      const cellColor = backgrounds[i][targetCol - CONFIG.SHIFT_COLUMNS.NAME];
      if (cellColor === targetColor) {
        const projectName = values[i][targetCol - CONFIG.SHIFT_COLUMNS.NAME];
        if (projectName && projectName !== "OJT") {
          return { name, projectName };
        }
      }
    }

    return null;
  },

  /**
   * リソースデータを取得
   * @return {Object} {data, hoursMap, scheduleMap}
   */
  getResourceData() {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const resourceSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.RESOURCE);

    if (!resourceSheet) {
      throw new Error(`「${CONFIG.SHEETS.RESOURCE}」シートが見つかりません`);
    }

    const lastRow = resourceSheet.getLastRow();
    if (lastRow < CONFIG.RESOURCE_START_ROW) {
      return { data: [], hoursMap: {}, scheduleMap: {} };
    }

    const rowCount = lastRow - CONFIG.RESOURCE_START_ROW + 1;
    const resourceData = resourceSheet.getRange(
      CONFIG.RESOURCE_START_ROW,
      1,
      rowCount,
      CONFIG.RESOURCE_TOTAL_COLS
    ).getValues();

    const hoursMap = this._getMergedCellMap(resourceSheet, CONFIG.RESOURCE_START_ROW, 5, rowCount);
    const scheduleMap = this._getMergedCellMap(resourceSheet, CONFIG.RESOURCE_START_ROW, 6, rowCount);

    return { data: resourceData, hoursMap, scheduleMap };
  },

  /**
   * マージされたセルの値をマップとして取得
   * @private
   * @param {Sheet} sheet シート
   * @param {number} startRow 開始行
   * @param {number} col 列番号
   * @param {number} numRows 行数
   * @return {Object} 行番号をキーとした値のマップ
   */
  _getMergedCellMap(sheet, startRow, col, numRows) {
    const range = sheet.getRange(startRow, col, numRows, 1);
    const mergedRanges = range.getMergedRanges();
    const values = range.getValues();
    const map = {};

    // 通常のセル値を登録
    for (let i = 0; i < values.length; i++) {
      if (values[i][0]) {
        map[startRow + i] = values[i][0];
      }
    }

    // マージされたセルの値を全行に展開
    for (const mergedRange of mergedRanges) {
      const value = mergedRange.getValue();
      const rangeStartRow = mergedRange.getRow();
      const endRow = rangeStartRow + mergedRange.getNumRows() - 1;

      for (let row = rangeStartRow; row <= endRow; row++) {
        map[row] = value;
      }
    }

    return map;
  },

  getNicknameMap() {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);

    if (!shiftSheet) return {};

    const lastRow = shiftSheet.getLastRow();
    if (lastRow < 3) return {};

    const names = shiftSheet.getRange(3, CONFIG.SHIFT_COLUMNS.NAME, lastRow - 2, 1).getValues();
    const nicknames = shiftSheet.getRange(3, CONFIG.SHIFT_COLUMNS.NICKNAME, lastRow - 2, 1).getValues();

    const map = {};
    for (let i = 0; i < names.length; i++) {
      if (names[i][0] && nicknames[i][0]) {
        map[names[i][0]] = nicknames[i][0];
      }
    }

    return map;
  },

  getStoreSheet() {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    return sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.STORE);
  },

  getNamesFromSourceSheet() {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);
    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);

    if (!shiftSheet) {
      throw new Error(`「${CONFIG.SHEETS.SHIFT}」シートが見つかりません`);
    }

    const lastRow = shiftSheet.getLastRow();
    const startRow = CONFIG.SHIFT_COLUMNS.NAME_START_ROW;

    if (lastRow < startRow) return [];

    const names = shiftSheet.getRange(startRow, CONFIG.SHIFT_COLUMNS.NAME, lastRow - startRow + 1, 1).getValues();

    const result = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i][0];
      if (name && typeof name === "string" && name.trim() !== "") {
        const processedName = Utils.preprocessName(name);
        if (processedName !== "" && Utils.isValidName(processedName)) {
          result.push(processedName);
        }
      }
    }

    return result;
  },

  getCustomProjectData(projectName, date) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const customSheet = ss.getSheetByName(CONFIG.CUSTOM_PROJECTS_SHEET_NAME);

    if (!customSheet) return null;

    const lastRow = customSheet.getLastRow();
    if (lastRow < 2) return null;

    const data = customSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    const settings = SettingsManager.getSettings();
    const isWeekendOrHoliday = Utils.isWeekendOrHoliday(date, settings.targetYear, settings.targetMonth);

    let noConditionMatch = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === projectName) {
        const condition = data[i][5] ? data[i][5].toString().trim() : "";

        if (condition === "平日" && !isWeekendOrHoliday) {
          return {
            projectName: data[i][0],
            venue: data[i][1] || "",
            content: data[i][2] || "",
            hours: data[i][3] || "",
            staff: data[i][4] || "",
          };
        } else if (condition === "土日祝" && isWeekendOrHoliday) {
          return {
            projectName: data[i][0],
            venue: data[i][1] || "",
            content: data[i][2] || "",
            hours: data[i][3] || "",
            staff: data[i][4] || "",
          };
        } else if (!condition && !noConditionMatch) {
          noConditionMatch = {
            projectName: data[i][0],
            venue: data[i][1] || "",
            content: data[i][2] || "",
            hours: data[i][3] || "",
            staff: data[i][4] || "",
          };
        }
      }
    }

    return noConditionMatch;
  },

  // ID管理シートから固定メンバー情報を取得
  getIdManagementData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const idSheet = ss.getSheetByName(CONFIG.SHEETS.ID_MANAGEMENT);

    if (!idSheet) return {};

    const lastRow = idSheet.getLastRow();
    if (lastRow < CONFIG.ID_MANAGEMENT.DATA_START_ROW) return {};

    const data = idSheet.getRange(
      CONFIG.ID_MANAGEMENT.DATA_START_ROW,
      CONFIG.ID_MANAGEMENT.NAME_COL,
      lastRow - CONFIG.ID_MANAGEMENT.DATA_START_ROW + 1,
      2
    ).getValues();

    const idMap = {};
    for (let i = 0; i < data.length; i++) {
      const name = data[i][0];
      const sheetId = data[i][1];
      if (name && name.toString().trim() !== "") {
        idMap[name] = sheetId || "";
      }
    }

    return idMap;
  },

  /**
   * 店舗名称マスターデータを取得
   * @return {Object} 略称をキー、正式名称を値とするマップ
   */
  getStoreNameMasterData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.STORE_NAME_MASTER_SHEET_NAME);

    if (!sheet) {
      Logger.log("店舗名称マスターシートが見つかりません");
      return {};
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < CONFIG.STORE_NAME_MASTER.DATA_START_ROW) {
      Logger.log("店舗名称マスターにデータがありません");
      return {};
    }

    const data = sheet.getRange(
      CONFIG.STORE_NAME_MASTER.DATA_START_ROW,
      CONFIG.STORE_NAME_MASTER.ABBREVIATED_NAME_COL,
      lastRow - CONFIG.STORE_NAME_MASTER.DATA_START_ROW + 1,
      2
    ).getValues();

    const nameMap = {};
    for (let i = 0; i < data.length; i++) {
      const abbreviated = data[i][0];
      const official = data[i][1];
      if (abbreviated && abbreviated.toString().trim() !== "") {
        nameMap[abbreviated.toString().trim()] = official || "";
      }
    }

    Logger.log(`店舗名称マスターから${Object.keys(nameMap).length}件のデータを取得しました`);
    return nameMap;
  },
};

// ========================================
// ビジネスロジック層
// ========================================
const BusinessLogic = {
  /**
   * 正規表現パターンキャッシュ（パフォーマンス最適化）
   * ループ内での正規表現生成を避けるため、事前コンパイル済みパターンを保持
   * @private
   */
  _patterns: {
    // スケジュール抽出用パターン
    nameFirst: /^([ぁ-んァ-ヶ一-龠々〆〤ヵヶa-zA-Z()（）\d]+[^：:]*?)\s*[：:]\s*(\d+)\/([^：:\n]+?)(?:\s*[：:]|$)/,
    dateFirst: /^(\d{1,2})\/([^：:\n]+?)\s*[：:]\s*([^：:\n]+?)(?:\s*[：:]|\s*\d+名|\n|$)/,

    // その他の頻出パターン（_OLD版メソッドで使用）
    monthExtract: /(\d+)\//,
    colonSplit: /[：:]/,
  },

  /**
   * シフトデータにリソース情報を付加
   * @param {Array} shiftData シフトデータ配列
   * @return {Object} {data: 拡張されたデータ, errors: エラーリスト}
   */
  enrichWithResourceData(shiftData) {
    const resourceResult = DataAccess.getResourceData();
    const resourceMap = this._buildResourceMap(
      resourceResult.data,
      resourceResult.hoursMap,
      resourceResult.scheduleMap
    );
    const errors = [];

    const result = [];
    for (const item of shiftData) {
      // 座学の特別処理
      if (item.projectName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU) {
        result.push({
          date: item.date,
          projectName: item.projectName,
          content: CONFIG.DEFAULT_CONTENTS.ZAKUGAKU,
          venue: CONFIG.DEFAULT_VENUES.ZAKUGAKU,
          hours: "",
          hasResourceData: true,
        });
        continue;
      }

      // リソースシートから情報を取得
      const resourceInfo = resourceMap[item.projectName];
      if (resourceInfo && resourceInfo.length > 0) {
        result.push(this._enrichShiftItem(item, resourceMap));
        continue;
      }

      // 個別案件設定から情報を取得
      const customProject = DataAccess.getCustomProjectData(item.projectName, item.date);
      if (customProject) {
        result.push({
          date: item.date,
          projectName: customProject.projectName,
          venue: customProject.venue,
          content: customProject.content,
          hours: customProject.hours,
          coworkers: customProject.staff,
          hasResourceData: true,
        });
        continue;
      }

      // 情報が見つからない場合
      errors.push(`${item.date}日: 案件「${item.projectName}」が見つかりません`);
      result.push({
        date: item.date,
        projectName: item.projectName,
        venue: "",
        content: "",
        hours: "",
        hasResourceData: false,
      });
    }

    return { data: result, errors };
  },

  processOJTData(name) {
    const ojtData = DataAccess.getOJTData(name);
    const processedOJT = [];
    const nicknameMap = DataAccess.getNicknameMap();

    for (const ojtItem of ojtData) {
      if (ojtItem.trainerInfo) {
        const trainerProjectName = ojtItem.trainerInfo.projectName;

        const resourceResult = DataAccess.getResourceData();
        const resourceMap = this._buildResourceMap(
          resourceResult.data,
          resourceResult.hoursMap,
          resourceResult.scheduleMap
        );
        const resourceInfo = resourceMap[trainerProjectName];

        let hours = "";
        let venue = "";
        let scheduleText = "";

        if (resourceInfo && resourceInfo.length > 0) {
          hours = this._extractWorkingHours(resourceInfo[0].hours, ojtItem.date);
          scheduleText = resourceInfo[0].scheduleText;

          const venues = this._extractVenuesFromSchedule(scheduleText, ojtItem.date);

          if (venues.length > 0) {
            venue = venues[0];
          }

          // 会場が取得できなかった、または不適切な場合は案件名ベースを使用
          if (!venue || venue.indexOf("軒先") !== -1 || venue.indexOf("ヘルパー") !== -1 || venue.indexOf("店頭") !== -1) {
            venue = this._getProjectBaseName(trainerProjectName);
          }
        }

        const trainerNickname = nicknameMap[ojtItem.trainerInfo.name] || ojtItem.trainerInfo.name;

        processedOJT.push({
          date: ojtItem.date,
          projectName: trainerProjectName,
          content: this._determineContent(trainerProjectName, scheduleText, ojtItem.date),
          venue,
          hours,
          hasResourceData: true,
          isOJT: true,
          trainerName: ojtItem.trainerInfo.name,
          coworkers: trainerNickname,
        });
      } else {
        processedOJT.push({
          date: ojtItem.date,
          projectName: "",
          content: "",
          venue: "",
          hours: "",
          hasResourceData: false,
          isOJT: true,
          trainerName: null,
          needsTrainerConfirmation: true,
        });
      }
    }

    return processedOJT;
  },

  _buildResourceMap(resourceData, hoursMap, scheduleMap) {
    const resourceMap = {};

    for (let i = 0; i < resourceData.length; i++) {
      const rowNum = i + 2;
      const projectName = resourceData[i][1];

      if (projectName) {
        if (!resourceMap[projectName]) {
          resourceMap[projectName] = [];
        }

        const hours = hoursMap[rowNum] || resourceData[i][4];
        const scheduleText = scheduleMap[rowNum] || resourceData[i][5];

        resourceMap[projectName].push({
          hours,
          scheduleText,
        });
      }
    }

    return resourceMap;
  },

  /**
   * 店舗名称マスターから正式名称を取得
   * @private
   * @param {string} projectName 案件名
   * @return {string|null} 正式名称（見つからない場合はnull）
   */
  _getOfficialStoreName(projectName) {
    const storeNameMap = DataAccess.getStoreNameMasterData();

    // 案件名から番号を除去したベース名
    const baseName = Utils.extractBaseName(projectName);

    // 完全一致を優先
    if (storeNameMap[baseName]) {
      Logger.log(`店舗名称マスター: ${baseName} → ${storeNameMap[baseName]}`);
      return storeNameMap[baseName];
    }

    // 部分一致で検索
    for (const abbreviated in storeNameMap) {
      if (baseName.indexOf(abbreviated) !== -1 || abbreviated.indexOf(baseName) !== -1) {
        Logger.log(`店舗名称マスター（部分一致）: ${baseName} → ${storeNameMap[abbreviated]}`);
        return storeNameMap[abbreviated];
      }
    }

    return null;
  },

  _enrichShiftItem(item, resourceMap) {
    const resourceInfo = resourceMap[item.projectName];

    if (!resourceInfo || resourceInfo.length === 0) {
      return {
        date: item.date,
        projectName: item.projectName,
        content: this._determineContent(item.projectName, ""),
        venue: "",
        hours: "",
        hasResourceData: false,
        errorMessage: `案件「${item.projectName}」がリソースに見つかりません`,
      };
    }

    let venue = "";
    let hours = "";
    let scheduleText = "";

    for (const resource of resourceInfo) {
      const venues = this._extractVenuesFromSchedule(resource.scheduleText, item.date);

      if (venues.length > 0) {
        venue = venues[0];
        hours = this._extractWorkingHours(resource.hours, item.date);
        scheduleText = resource.scheduleText;
        break;
      }
    }

    if (!venue && resourceInfo.length > 0) {
      hours = this._extractWorkingHours(resourceInfo[0].hours, item.date);
      scheduleText = resourceInfo[0].scheduleText;
    }

    if (!venue || venue.indexOf("軒先") !== -1 || venue.indexOf("ヘルパー") !== -1 || venue.indexOf("店頭") !== -1) {
      venue = this._getProjectBaseName(item.projectName);
    }

    const content = this._determineContent(item.projectName, scheduleText, item.date);

    // 内容が「店頭ヘルパー」または「軒先販売」の場合、店舗名称マスターを参照
    if (content === CONFIG.DEFAULT_CONTENTS.TENTOU_HELPER ||
        content === CONFIG.DEFAULT_CONTENTS.NOKISAKI) {
      const officialName = this._getOfficialStoreName(item.projectName);
      if (officialName) {
        venue = officialName;
      }
    }

    return {
      date: item.date,
      projectName: item.projectName,
      content,
      venue,
      hours,
      hasResourceData: true,
    };
  },

  _getProjectBaseName(projectName) {
    // StringUtilsのextractBaseNameを使用
    return StringUtils.extractBaseName(projectName);
  },

  /**
   * スケジュールテキストから会場または内容を抽出（統合版）
   *
   * 重複していた _extractVenuesFromSchedule と _extractContentFromSchedule のロジックを統合。
   * extractType パラメータで挙動を切り替えます。
   *
   * @private
   * @param {string} scheduleText - スケジュールテキスト（F列）
   * @param {number} targetDate - 対象日付（1-31）
   * @param {'venue'|'content'} extractType - 抽出タイプ
   * @returns {Array<string>|string} venue: 配列, content: 文字列（最初の1件）
   *
   * @example
   * // 会場抽出
   * const venues = this._extractFromSchedule("ベイシア：11/1-3", 1, 'venue');
   * // => ["ベイシア"]
   *
   * // 内容抽出
   * const content = this._extractFromSchedule("店頭ヘルパー：11/1-3", 1, 'content');
   * // => "店頭ヘルパー"
   */
  _extractFromSchedule(scheduleText, targetDate, extractType) {
    if (!scheduleText) {
      return extractType === 'venue' ? [] : "";
    }

    const settings = SettingsManager.getSettings();
    const isVerbose = ConfigManager.isVerboseLogging();
    const results = [];

    // ログヘッダー
    const logPrefix = extractType === 'venue' ? '会場抽出' : '内容抽出';
    if (extractType === 'venue') {
      Logger.log(`========================================`);
      Logger.log(`${logPrefix}開始`);
      Logger.log(`  対象年月: ${settings.targetYear}年${settings.targetMonth}月`);
      Logger.log(`  対象日: ${targetDate}日`);
      Logger.log(`  scheduleText:\n${scheduleText}`);
      Logger.log(`========================================`);
    }

    // 正規表現パターン（事前コンパイル済みキャッシュを使用）
    const { nameFirst, dateFirst } = this._patterns;

    // 改行で分割
    const lines = scheduleText.split(/\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // 行頭の・や•を削除（StringUtilsを使用）
      const cleanedLine = StringUtils.removeLeadingBullets(trimmed);

      if (isVerbose) {
        Logger.log(`\n--- [${logPrefix}] 処理中の行 ---`);
        Logger.log(`元の行: "${trimmed}"`);
        Logger.log(`クリーン後: "${cleanedLine}"`);
      }

      // パターンA: 名前：月/日付範囲（キャッシュされたパターン使用）
      const nameMatch = cleanedLine.match(nameFirst);

      if (nameMatch) {
        const month = parseInt(nameMatch[2]);
        const name = nameMatch[1].trim();
        const dateRange = nameMatch[3];

        if (isVerbose) {
          const itemType = extractType === 'venue' ? '会場名' : '内容名';
          Logger.log(`パターンAマッチ: ${itemType}="${name}", 月=${month}, 日付範囲="${dateRange}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        const fullDateRange = StringUtils.getBeforeColon(`${month}/${dateRange}`);
        if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

        const dates = this._expandDatesFromRange(fullDateRange);
        if (isVerbose) {
          Logger.log(`  展開された日付: [${dates.join(', ')}]`);
          Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
        }

        if (dates.indexOf(targetDate) !== -1) {
          const itemType = extractType === 'venue' ? '会場名' : '内容名';
          if (isVerbose) Logger.log(`  → ${itemType}を追加: "${name}"`);
          results.push(name);
        }

        continue;
      }

      // パターンB: 日付→名前形式（キャッシュされたパターン使用）
      const dateMatch = cleanedLine.match(dateFirst);

      if (dateMatch) {
        const month = parseInt(dateMatch[1]);
        const dateRange = dateMatch[2];
        const rawName = dateMatch[3].trim();

        if (isVerbose) {
          const itemType = extractType === 'venue' ? '会場' : '内容';
          Logger.log(`パターンBマッチ: 月=${month}, 日付範囲="${dateRange}", ${itemType}="${rawName}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        // クリーニング処理（タイプによって異なる）
        let cleanedName;
        if (extractType === 'venue') {
          cleanedName = StringUtils.cleanVenueText(rawName);
        } else {
          cleanedName = StringUtils.cleanContentText(rawName);
        }

        if (cleanedName && cleanedName.length > 0) {
          const fullDateRange = StringUtils.getBeforeColon(`${month}/${dateRange}`);
          if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

          const dates = this._expandDatesFromRange(fullDateRange);
          if (isVerbose) {
            Logger.log(`  展開された日付: [${dates.join(', ')}]`);
            Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
          }

          if (dates.indexOf(targetDate) !== -1) {
            const itemType = extractType === 'venue' ? '会場名' : '内容名';
            if (isVerbose) Logger.log(`  → ${itemType}を追加: "${cleanedName}"`);
            results.push(cleanedName);
          }
        }

        continue;
      }

      // どちらのパターンにもマッチしない場合
      if (isVerbose) Logger.log(`どのパターンにもマッチしませんでした`);
    }

    // 最終ログと返却
    if (extractType === 'venue') {
      Logger.log(`\n========================================`);
      Logger.log(`最終的な会場リスト: [${results.join(', ')}]`);
      Logger.log(`========================================\n`);
      return results;
    } else {
      if (isVerbose) {
        Logger.log(`\n========================================`);
        Logger.log(`[内容抽出] 最終リスト: [${results.join(', ')}]`);
        Logger.log(`========================================\n`);
      }
      return results.length > 0 ? results[0] : "";
    }
  },

  /**
   * スケジュールテキストから特定日付の内容を抽出
   * @private
   * @param {string} scheduleText スケジュールテキスト（F列）
   * @param {number} targetDate 対象日付
   * @return {string} 内容（見つからない場合は空文字）
   */
  _extractContentFromSchedule(scheduleText, targetDate) {
    return this._extractFromSchedule(scheduleText, targetDate, 'content');
  },

  /**
   * [DEPRECATED] スケジュールテキストから特定日付の内容を抽出（旧実装）
   * 統合版の _extractFromSchedule を使用するため、このメソッドは非推奨です。
   * @deprecated
   */
  _extractContentFromSchedule_OLD(scheduleText, targetDate) {
    if (!scheduleText) return "";

    const settings = SettingsManager.getSettings();
    const contents = [];
    const isVerbose = ConfigManager.isVerboseLogging();

    // 改行で分割
    const lines = scheduleText.split(/\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // 行頭の・や•を削除
      const cleanedLine = trimmed.replace(/^[・•]\s*/, '');

      if (isVerbose) {
        Logger.log(`\n--- [内容抽出] 処理中の行 ---`);
        Logger.log(`元の行: "${trimmed}"`);
        Logger.log(`クリーン後: "${cleanedLine}"`);
      }

      // パターンA: 内容名：月/日付範囲（例：店頭ヘルパー：11/1〜3）
      const contentFirstPattern = /^([ぁ-んァ-ヶ一-龠々〆〤ヵヶa-zA-Z\(\)（）\d]+[^：:]*?)\s*[：:]\s*(\d+)\/([^：:\n]+?)(?:\s*[：:]|$)/;
      const contentMatch = cleanedLine.match(contentFirstPattern);

      if (contentMatch) {
        const month = parseInt(contentMatch[2]);

        if (isVerbose) {
          Logger.log(`パターンAマッチ: 内容名="${contentMatch[1]}", 月=${month}, 日付範囲="${contentMatch[3]}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        const contentName = contentMatch[1].trim();
        const dateRange = contentMatch[3];
        const fullDateRange = `${month}/${dateRange}`.split(colonSplit)[0];

        if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

        const dates = this._expandDatesFromRange(fullDateRange);

        if (isVerbose) {
          Logger.log(`  展開された日付: [${dates.join(', ')}]`);
          Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
        }

        if (dates.indexOf(targetDate) !== -1) {
          if (isVerbose) Logger.log(`  → 内容名を追加: "${contentName}"`);
          contents.push(contentName);
        }

        continue;
      }

      // パターンB: 日付→内容名形式（例：10/1～3：店頭ヘルパー）
      const dateFirstPattern = /^(\d{1,2})\/([^：:\n]+?)\s*[：:]\s*([^：:\n]+?)(?:\s*[：:]|\s*\d+名|\n|$)/;
      const dateMatch = cleanedLine.match(dateFirstPattern);

      if (dateMatch) {
        const month = parseInt(dateMatch[1]);

        if (isVerbose) {
          Logger.log(`パターンBマッチ: 月=${month}, 日付範囲="${dateMatch[2]}", 内容="${dateMatch[3]}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        const dateRange = dateMatch[2];
        const content = dateMatch[3].trim();

        const cleanContent = StringUtils.cleanContentText(content);

        if (cleanContent && cleanContent.length > 0) {
          const fullDateRange = `${month}/${dateRange}`.split(colonSplit)[0];
          if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

          const dates = this._expandDatesFromRange(fullDateRange);

          if (isVerbose) {
            Logger.log(`  展開された日付: [${dates.join(', ')}]`);
            Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
          }

          if (dates.indexOf(targetDate) !== -1) {
            if (isVerbose) Logger.log(`  → 内容名を追加: "${cleanContent}"`);
            contents.push(cleanContent);
          }
        }

        continue;
      }

      if (isVerbose) Logger.log(`どのパターンにもマッチしませんでした`);
    }

    if (isVerbose) {
      Logger.log(`\n========================================`);
      Logger.log(`[内容抽出] 最終リスト: [${contents.join(', ')}]`);
      Logger.log(`========================================\n`);
    }

    return contents.length > 0 ? contents[0] : "";
  },

  /**
   * セグメントから日付範囲と内容のパターンを抽出
   * @private
   * @param {string} segment セグメント
   * @param {number} month 月
   * @return {Array} [{dateRange: "10/3,6-7", content: "店頭ヘルパー"}, ...]
   */
  _extractDateContentPatterns(segment, month) {
    const patterns = [];

    try {
      // パターン1: 月/日付範囲：内容名（既存ロジック）
      const withMonthPattern = /(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\n]+?)(?=\s*[：:]|\s*\d+名|\n|$)/g;
      let match;

      while ((match = withMonthPattern.exec(segment)) !== null) {
        const dateRange = match[1];
        const content = match[2].trim();

        const cleanContent = StringUtils.cleanContentText(content);

        if (cleanContent && cleanContent.length > 0) {
          patterns.push({
            dateRange,
            content: cleanContent,
          });
        }
      }

      // パターン2: 内容名：日付範囲（新規ロジック - 修正版）
      if (patterns.length === 0) {
        // 月が含まれるパターン: ベイシア香取小見川：11/1〜3
        const contentFirstWithMonthPattern = /([^：:\d\n]+?)\s*[：:]\s*(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)/g;

        while ((match = contentFirstWithMonthPattern.exec(segment)) !== null) {
          const content = match[1].trim();
          const dateRange = match[2];

          const cleanContent = StringUtils.cleanContentText(content);

          if (cleanContent && cleanContent.length > 0) {
            patterns.push({
              dateRange,
              content: cleanContent,
            });
          }
        }
      }

      // パターン3: 月なし（既存ロジック）
      if (patterns.length === 0) {
        const withoutMonthPattern = /(?:^|\s)([\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\d]+?)(?=[：:]|\d+[\/\-]|$)/g;

        while ((match = withoutMonthPattern.exec(segment)) !== null) {
          const dateText = match[1].trim();
          if (!/\//.test(dateText) && /[\d]/.test(dateText)) {
            const content = match[2].trim();
            const cleanContent = StringUtils.cleanContentText(content);

            if (cleanContent && cleanContent.length > 0) {
              patterns.push({
                dateRange: `${month}/${dateText}`,
                content: cleanContent,
              });
            }
          }
        }
      }
    } catch (e) {
      Logger.log(`内容抽出エラー: ${e.message}, segment: ${segment}`);
    }

    return patterns;
  },

  /**
   * 案件名とスケジュールから内容を判定（修正版）
   * @private
   * @param {string} projectName 案件名
   * @param {string} scheduleText スケジュールテキスト（F列）
   * @param {number} targetDate 対象日付（追加）
   * @return {string} 内容
   */
  _determineContent(projectName, scheduleText, targetDate) {
    if (!projectName || projectName.trim() === "") return "";

    const trimmedName = projectName.trim();

    // スキップする案件
    const skipPatterns = [
      CONFIG.SPECIAL_PROJECTS.KIBOU_YASUMI,
      CONFIG.SPECIAL_PROJECTS.KOUKYUU,
      CONFIG.SPECIAL_PROJECTS.SANKAKU
    ];
    if (skipPatterns.indexOf(trimmedName) !== -1) return "";

    // 座学
    if (trimmedName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU) {
      return CONFIG.DEFAULT_CONTENTS.ZAKUGAKU;
    }

    // 【優先順位1】F列（scheduleText）から特定日付の内容を判定
    if (scheduleText && typeof scheduleText === "string" && targetDate) {
      const extractedContent = this._extractContentFromSchedule(scheduleText, targetDate);

      if (extractedContent) {
        // 抽出した内容を正規化
        if (/軒先兼出張販売ヘルパー/.test(extractedContent)) {
          return "軒先兼出張販売ヘルパー";
        }
        if (/店頭ヘルパー/.test(extractedContent)) {
          return CONFIG.DEFAULT_CONTENTS.TENTOU_HELPER;
        }
        if (/軒先ヘルパー/.test(extractedContent) || /軒先/.test(extractedContent)) {
          return CONFIG.DEFAULT_CONTENTS.NOKISAKI;
        }
      }
    }

    // 【優先順位2】案件名から内容を判定
    // 店頭ヘルパー
    if (/[（(]店[）)]/.test(trimmedName)) {
      return CONFIG.DEFAULT_CONTENTS.TENTOU_HELPER;
    }

    // 軒先販売
    if (/[（(]軒[）)]/.test(trimmedName)) {
      return CONFIG.DEFAULT_CONTENTS.NOKISAKI;
    }

    // 【優先順位3】デフォルトは出張販売
    return CONFIG.DEFAULT_CONTENTS.SHUCCHOU_HANBAI;
  },

  /**
   * スケジュールテキストから特定日付の会場を抽出
   * @private
   * @param {string} scheduleText スケジュールテキスト（F列）
   * @param {number} targetDate 対象日付
   * @return {Array<string>} 会場リスト
   */
  _extractVenuesFromSchedule(scheduleText, targetDate) {
    return this._extractFromSchedule(scheduleText, targetDate, 'venue');
  },

  /**
   * [DEPRECATED] スケジュールテキストから特定日付の会場を抽出（旧実装）
   * 統合版の _extractFromSchedule を使用するため、このメソッドは非推奨です。
   * @deprecated
   */
  _extractVenuesFromSchedule_OLD(scheduleText, targetDate) {
    if (!scheduleText) return [];

    const settings = SettingsManager.getSettings();

    Logger.log(`========================================`);
    Logger.log(`会場抽出開始`);
    Logger.log(`  対象年月: ${settings.targetYear}年${settings.targetMonth}月`);
    Logger.log(`  対象日: ${targetDate}日`);
    Logger.log(`  scheduleText:\n${scheduleText}`);
    Logger.log(`========================================`);

    const venues = [];

    // 改行で分割
    const lines = scheduleText.split(/\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // 行頭の・や•を削除
      const cleanedLine = trimmed.replace(/^[・•]\s*/, '');

      const isVerbose = ConfigManager.isVerboseLogging();
      if (isVerbose) {
        Logger.log(`\n--- 処理中の行 ---`);
        Logger.log(`元の行: "${trimmed}"`);
        Logger.log(`クリーン後: "${cleanedLine}"`);
      }

      // パターンA: 会場名：月/日付範囲（例：ベイシア香取小見川：11/1〜3、イオンモール多摩平の森（1Fセンターコート）：10/1～3）
      const venueFirstPattern = /^([ぁ-んァ-ヶ一-龠々〆〤ヵヶa-zA-Z\(\)（）\d]+[^：:]*?)\s*[：:]\s*(\d+)\/([^：:\n]+?)(?:\s*[：:]|$)/;
      const venueMatch = cleanedLine.match(venueFirstPattern);

      if (venueMatch) {
        const month = parseInt(venueMatch[2]);
        if (isVerbose) {
          Logger.log(`パターンAマッチ: 会場名="${venueMatch[1]}", 月=${month}, 日付範囲="${venueMatch[3]}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        const venueName = venueMatch[1].trim();
        const dateRange = venueMatch[3];
        const fullDateRange = `${month}/${dateRange}`.split(colonSplit)[0];

        if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

        const dates = this._expandDatesFromRange(fullDateRange);
        if (isVerbose) {
          Logger.log(`  展開された日付: [${dates.join(', ')}]`);
          Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
        }

        if (dates.indexOf(targetDate) !== -1) {
          if (isVerbose) Logger.log(`  → 会場名を追加: "${venueName}"`);
          venues.push(venueName);
        }

        continue;
      }

      // パターンB: 日付→会場名形式（例：10/1～3：イオンモール...）
      const dateFirstPattern = /^(\d{1,2})\/([^：:\n]+?)\s*[：:]\s*([^：:\n]+?)(?:\s*[：:]|\s*\d+名|\n|$)/;
      const dateMatch = cleanedLine.match(dateFirstPattern);

      if (dateMatch) {
        const month = parseInt(dateMatch[1]);
        const dateRange = dateMatch[2];
        const venue = dateMatch[3].trim();

        if (isVerbose) {
          Logger.log(`パターンBマッチ: 月=${month}, 日付範囲="${dateRange}", 会場="${venue}"`);
          Logger.log(`  対象月(${settings.targetMonth})と一致? ${month === settings.targetMonth ? 'YES' : 'NO'}`);
        }

        if (month !== settings.targetMonth) {
          if (isVerbose) Logger.log(`  → 月が一致しないためスキップ`);
          continue;
        }

        const cleanVenue = venue
          .replace(/[：:].*$/, '')
          .replace(/＋[^：:（）()]*$/, '')
          .replace(/\s*\d+名.*$/, '')
          .trim();

        if (cleanVenue && cleanVenue.length > 0) {
          const fullDateRange = `${month}/${dateRange}`.split(colonSplit)[0];
          if (isVerbose) Logger.log(`  処理する日付範囲: "${fullDateRange}"`);

          const dates = this._expandDatesFromRange(fullDateRange);
          if (isVerbose) {
            Logger.log(`  展開された日付: [${dates.join(', ')}]`);
            Logger.log(`  対象日(${targetDate})が含まれる? ${dates.indexOf(targetDate) !== -1 ? 'YES' : 'NO'}`);
          }

          if (dates.indexOf(targetDate) !== -1) {
            if (isVerbose) Logger.log(`  → 会場名を追加: "${cleanVenue}"`);
            venues.push(cleanVenue);
          }
        }

        continue;
      }

      // どちらのパターンにもマッチしない場合
      if (isVerbose) Logger.log(`どのパターンにもマッチしませんでした`);
    }

    Logger.log(`\n========================================`);
    Logger.log(`最終的な会場リスト: [${venues.join(', ')}]`);
    Logger.log(`========================================\n`);

    return venues;
  },

  _extractDateVenuePatterns(segment, month) {
    const patterns = [];

    Logger.log(`      _extractDateVenuePatterns呼び出し: segment="${segment}", month=${month}`);

    try {
      // パターン1: 日付→会場名（既存ロジック）
      // 例: 10/3,6-7：テラス湘南
      const withMonthPattern = /(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\n]+?)(?=\s*[：:]|\s*\d+名|\n|$)/g;
      let match;

      Logger.log(`        パターン1チェック中...`);
      while ((match = withMonthPattern.exec(segment)) !== null) {
        Logger.log(`        パターン1マッチ: "${match[0]}"`);
        Logger.log(`          日付部分: "${match[1]}", 会場部分: "${match[2]}"`);

        const dateRange = match[1];
        const venue = match[2].trim();

        const cleanVenue = venue
          .replace(/[：:].*$/, '')
          .replace(/＋[^：:（）()]*$/, '')
          .replace(/\s*\d+名.*$/, '')
          .trim();

        Logger.log(`          クリーン後の会場名: "${cleanVenue}"`);

        if (cleanVenue && cleanVenue.length > 0) {
          patterns.push({
            dateRange,
            venue: cleanVenue,
          });
          Logger.log(`          → パターンに追加`);
        }
      }

      // パターン2: 会場名→日付（新規ロジック - 修正版）
      // パターン1で見つからなかった場合のみ実行
      if (patterns.length === 0) {
        Logger.log(`        パターン2チェック中...`);
        // 月が含まれるパターン: ベイシア香取小見川：11/1〜3
        const venueFirstWithMonthPattern = /([^：:\d\n]+?)\s*[：:]\s*(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)/g;

        while ((match = venueFirstWithMonthPattern.exec(segment)) !== null) {
          Logger.log(`        パターン2マッチ: "${match[0]}"`);
          Logger.log(`          会場部分: "${match[1]}", 日付部分: "${match[2]}"`);

          const venue = match[1].trim();
          const dateRange = match[2];

          const cleanVenue = venue
            .replace(/[：:].*$/, '')
            .replace(/＋[^：:（）()]*$/, '')
            .replace(/\s*\d+名.*$/, '')
            .trim();

          Logger.log(`          クリーン後の会場名: "${cleanVenue}"`);

          if (cleanVenue && cleanVenue.length > 0) {
            patterns.push({
              dateRange,
              venue: cleanVenue,
            });
            Logger.log(`          → パターンに追加`);
          }
        }
      }

      // パターン3: 月なし日付範囲：会場名（既存ロジック）
      if (patterns.length === 0) {
        Logger.log(`        パターン3チェック中...`);
        const withoutMonthPattern = /(?:^|\s)([\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\d]+?)(?=[：:]|\d+[\/\-]|$)/g;

        while ((match = withoutMonthPattern.exec(segment)) !== null) {
          Logger.log(`        パターン3マッチ: "${match[0]}"`);
          Logger.log(`          日付部分: "${match[1]}", 会場部分: "${match[2]}"`);

          const dateText = match[1].trim();
          if (!/\//.test(dateText) && /[\d]/.test(dateText)) {
            const venue = match[2].trim();
            const cleanVenue = venue
              .replace(/[：:].*$/, '')
              .replace(/＋[^：:（）()]*$/, '')
              .replace(/\s*\d+名.*$/, '')
              .trim();

            Logger.log(`          クリーン後の会場名: "${cleanVenue}"`);
            Logger.log(`          月を付与した日付範囲: "${month}/${dateText}"`);

            if (cleanVenue && cleanVenue.length > 0) {
              patterns.push({
                dateRange: `${month}/${dateText}`,
                venue: cleanVenue,
              });
              Logger.log(`          → パターンに追加`);
            }
          }
        }
      }
    } catch (e) {
      Logger.log(`        エラー: ${e.message}`);
    }

    Logger.log(`      最終的なpatterns数: ${patterns.length}`);
    return patterns;
  },

  _expandDatesFromRange(dateRangeText) {
    return DateUtils.expandDatesFromRange(dateRangeText);
  },

  _extractWorkingHours(hoursText, targetDate) {
    if (!hoursText || typeof hoursText !== "string") return "";

    const settings = SettingsManager.getSettings();
    const normalized = StringUtils.normalizeWhitespace(hoursText);
    const isWeekendOrHoliday = Utils.isWeekendOrHoliday(targetDate, settings.targetYear, settings.targetMonth);

    const weekendPattern = /(\d{1,2}:\d{2}[\-〜~～]\d{1,2}:\d{2})[^0-9]*土日祝/;
    const weekdayPattern = /(\d{1,2}:\d{2}[\-〜~～]\d{1,2}:\d{2})[^0-9]*平日/;

    const weekendMatch = normalized.match(weekendPattern);
    const weekdayMatch = normalized.match(weekdayPattern);

    if (isWeekendOrHoliday && weekendMatch) {
      return Utils.normalizeTimeFormat(weekendMatch[1]);
    }
    if (!isWeekendOrHoliday && weekdayMatch) {
      return Utils.normalizeTimeFormat(weekdayMatch[1]);
    }

    const generalPattern = /(\d{1,2}:\d{2}[\-〜~～]\d{1,2}:\d{2})/;
    const generalMatch = normalized.match(generalPattern);

    return generalMatch ? Utils.normalizeTimeFormat(generalMatch[1]) : "";
  },

  addCoworkersInfo(shiftData, selectedName) {
    const nicknameMap = DataAccess.getNicknameMap();
    const targetNickname = nicknameMap[selectedName];

    if (!targetNickname) {
      Logger.log(`${selectedName}の略称が見つかりません`);
      return shiftData;
    }

    const storeSheet = DataAccess.getStoreSheet();
    if (!storeSheet) {
      Logger.log("店舗別シートが見つかりません");
      return shiftData;
    }

    const lastRow = storeSheet.getLastRow();
    const lastCol = storeSheet.getLastColumn();

    const storeNames = storeSheet.getRange(
      CONFIG.STORE_CONFIG.DATA_START_ROW,
      CONFIG.STORE_CONFIG.NAME_COL,
      lastRow - CONFIG.STORE_CONFIG.DATA_START_ROW + 1,
      1
    ).getValues();

    const dateHeaders = storeSheet.getRange(
      CONFIG.STORE_CONFIG.DATE_ROW,
      CONFIG.STORE_CONFIG.DATA_START_COL,
      1,
      lastCol - CONFIG.STORE_CONFIG.DATA_START_COL + 1
    ).getValues()[0];

    const staffData = storeSheet.getRange(
      CONFIG.STORE_CONFIG.DATA_START_ROW,
      CONFIG.STORE_CONFIG.DATA_START_COL,
      lastRow - CONFIG.STORE_CONFIG.DATA_START_ROW + 1,
      lastCol - CONFIG.STORE_CONFIG.DATA_START_COL + 1
    ).getValues();

    const dateColMap = {};
    for (let i = 0; i < dateHeaders.length; i++) {
      const day = Utils.extractDay(dateHeaders[i]);
      if (day) {
        dateColMap[day] = i;
      }
    }

    const result = [];
    for (const item of shiftData) {
      const newItem = { ...item };

      // OJTの場合は既にトレーナーの略称が設定されているので、そのまま使用
      if (item.isOJT && item.coworkers) {
        newItem.coworkers = item.coworkers;
      } else if (item.projectName) {
        newItem.coworkers = this._findCoworkersFromCache(item.projectName, item.date, targetNickname, storeNames, staffData, dateColMap);
      } else {
        newItem.coworkers = "";
      }

      result.push(newItem);
    }

    return result;
  },

  _findCoworkersFromCache(projectName, targetDate, excludeNickname, storeNames, staffData, dateColMap) {
    const baseName = Utils.extractBaseName(projectName);
    const colIndex = dateColMap[targetDate];

    if (colIndex === undefined) return "";

    const coworkersSet = {};

    for (let i = 0; i < storeNames.length; i++) {
      const storeName = storeNames[i][0];
      if (!storeName) continue;

      const storeBaseName = Utils.extractBaseName(storeName);

      if (storeBaseName === baseName) {
        const staffNickname = staffData[i][colIndex];

        if (staffNickname && staffNickname !== excludeNickname) {
          coworkersSet[staffNickname] = true;
        }
      }
    }

    return Object.keys(coworkersSet).sort().join("・");
  },

  // トレーナーの同時入店スタッフにOJT対象者を追加
  addOJTTraineesInfo(shiftData, trainerName) {
    const nicknameMap = DataAccess.getNicknameMap();
    const allOJTData = DataAccess.getAllOJTData();

    if (!allOJTData || allOJTData.length === 0) {
      return shiftData;
    }

    // このトレーナーのOJT対象者を日付別に整理
    const traineesByDate = {};

    for (const ojtItem of allOJTData) {
      if (ojtItem.trainerInfo && ojtItem.trainerInfo.name === trainerName) {
        const traineeNickname = nicknameMap[ojtItem.traineeName] || ojtItem.traineeName;

        if (!traineesByDate[ojtItem.date]) {
          traineesByDate[ojtItem.date] = [];
        }
        traineesByDate[ojtItem.date].push(traineeNickname);
      }
    }

    // shiftDataにOJT対象者を追加
    const result = [];
    for (const item of shiftData) {
      const newItem = { ...item };

      // この日にOJT対象者がいる場合
      if (traineesByDate[item.date]) {
        const existingCoworkers = newItem.coworkers || "";
        const trainees = traineesByDate[item.date].sort().join("・");

        if (existingCoworkers) {
          // 既存の同時入店スタッフにOJT対象者を追加
          newItem.coworkers = `${existingCoworkers}・${trainees}`;
        } else {
          newItem.coworkers = trainees;
        }
      }

      result.push(newItem);
    }

    return result;
  },
};

// ========================================
// 個人シフトシート操作の最適化
// ========================================
const PersonalSheetManager = {
  // 最適化版：シート確保
  ensureSheetOptimized(sheetId, targetSheetName, selectedName) {
    const personalSpreadsheet = SpreadsheetApp.openById(sheetId);
    let personalSheet = personalSpreadsheet.getSheetByName(targetSheetName);

    if (!personalSheet) {
      personalSheet = personalSpreadsheet.insertSheet(targetSheetName);
      this._createHeaders(personalSheet, selectedName);
      this._generateDateHeaders(personalSheet);
    } else {
      personalSheet.getRange(3, 1).setValue(selectedName).setFontWeight("bold");
      // 日付ヘッダーのチェックをスキップ（既存シートは存在すると仮定）
    }

    personalSheet.setFrozenRows(CONFIG.PERSONAL_ROWS.DAY_OF_WEEK);
    personalSheet.setFrozenColumns(1);

    return personalSheet;
  },

  // 最適化版：データ転記（一括書き込み）
  transferDataOptimized(sheet, data) {
    const dateColumnMap = this._createDateColumnMap(sheet);
    const existingData = this._saveExistingData(sheet, dateColumnMap, data);

    // データを日付順にソート
    data.sort((a, b) => a.date - b.date);

    // 書き込むデータを行列形式で準備
    const settings = SettingsManager.getSettings();
    const daysInMonth = new Date(settings.targetYear, settings.targetMonth, 0).getDate();

    // 各行のデータ配列を準備
    const projectRow = new Array(daysInMonth).fill("");
    const venueRow = new Array(daysInMonth).fill("");
    const contentRow = new Array(daysInMonth).fill("");
    const hoursRow = new Array(daysInMonth).fill("");
    const staffRow = new Array(daysInMonth).fill("");
    const notesRow = new Array(daysInMonth).fill("");
    const backgrounds = [];
    for (let i = 0; i < 6; i++) {
      backgrounds.push(new Array(daysInMonth).fill("#FFFFFF"));
    }

    let transferCount = 0;

    // データを配列に格納
    for (const item of data) {
      const colIndex = dateColumnMap[String(item.date)];

      if (!colIndex) continue;

      const arrayIndex = colIndex - CONFIG.PERSONAL_ROWS.START_COL;

      if (item.projectName) {
        projectRow[arrayIndex] = item.projectName;

        // 色設定
        const projectNameLower = item.projectName.toLowerCase().trim();
        const color = CONFIG.PROJECT_COLORS[projectNameLower];
        if (color) {
          for (let j = 0; j < 5; j++) {
            backgrounds[j][arrayIndex] = color;
          }
        }
      }

      if (item.hasResourceData && item.venue) {
        venueRow[arrayIndex] = item.venue;
      }

      if (item.content) {
        contentRow[arrayIndex] = item.content;
      }

      // 稼働時間の処理（手動入力を優先）
      const existingHours = existingData.hours[item.date];
      if (existingHours) {
        // 手動入力がある場合は保持
        hoursRow[arrayIndex] = existingHours;
      } else if (item.projectName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU) {
        // 座学で手動入力がない場合は空欄にして「要時間確認」メッセージ
        hoursRow[arrayIndex] = "";
        notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.NEED_TIME_CONFIRMATION;
      } else if (item.hasResourceData && item.hours) {
        // リソースシートからの稼働時間を使用
        hoursRow[arrayIndex] = item.hours;
      }

      if (item.coworkers) {
        staffRow[arrayIndex] = item.coworkers;
      }

      // OJT処理（補足事項の設定）
      if (item.isOJT) {
        if (item.needsTrainerConfirmation) {
          notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.NEED_TRAINER_CONFIRMATION;
        } else {
          notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.OJT_LABEL;
        }
      }

      transferCount++;
    }

    // 手動コメントを復元
    for (const day in existingData.notes) {
      const colIndex = dateColumnMap[day];
      if (!colIndex) continue;

      const arrayIndex = colIndex - CONFIG.PERSONAL_ROWS.START_COL;
      const note = existingData.notes[day];

      // システムメッセージが設定されていない場合のみ復元
      if (!notesRow[arrayIndex] && !this._isSystemMessage(note)) {
        notesRow[arrayIndex] = note;
      }
    }

    // 一括書き込み
    const dataToWrite = [
      projectRow,
      venueRow,
      contentRow,
      hoursRow,
      staffRow,
      notesRow
    ];

    sheet.getRange(
      CONFIG.PERSONAL_ROWS.PROJECT,
      CONFIG.PERSONAL_ROWS.START_COL,
      6,
      daysInMonth
    ).setValues(dataToWrite).setBackgrounds(backgrounds);

    return transferCount;
  },

  // その他のメソッドは既存と同じ
  _createHeaders(sheet, selectedName) {
    const settings = SettingsManager.getSettings();
    sheet.setColumnWidth(1, 150);

    sheet.getRange(2, 1)
      .setValue(`${settings.targetYear}年${settings.targetMonth}月`)
      .setFontWeight("bold")
      .setFontSize(12);

    sheet.getRange(3, 1).setValue(selectedName).setFontWeight("bold");

    const headerCol = CONFIG.PERSONAL_ROWS.START_COL - 1;
    const headers = ["案件名", "会場", "内容", "稼働時間", "同時入店スタッフ"];

    for (let i = 0; i < headers.length; i++) {
      sheet.getRange(CONFIG.PERSONAL_ROWS.PROJECT + i, headerCol).setValue(headers[i]);
    }

    sheet.getRange(9, 1).setValue("補足事項");

    const headerRange = sheet.getRange(2, 1, 8, 1);
    headerRange.setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  },

  _generateDateHeaders(sheet) {
    const settings = SettingsManager.getSettings();
    const { dates, daysOfWeek } = DateUtils.generateDateArrays(settings.targetYear, settings.targetMonth);
    const daysInMonth = dates.length;

    sheet.getRange(CONFIG.PERSONAL_ROWS.DATE, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth).setValues([dates]);
    sheet.getRange(CONFIG.PERSONAL_ROWS.DAY_OF_WEEK, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth).setValues([daysOfWeek]);

    for (let i = 0; i < daysInMonth; i++) {
      sheet.setColumnWidth(CONFIG.PERSONAL_ROWS.START_COL + i, 100);
    }

    const dataRange = sheet.getRange(CONFIG.PERSONAL_ROWS.DATE, CONFIG.PERSONAL_ROWS.START_COL, 8, daysInMonth);
    dataRange.setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold");

    const venueRange = sheet.getRange(CONFIG.PERSONAL_ROWS.VENUE, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth);
    venueRange.setWrap(true);

    const notesRange = sheet.getRange(CONFIG.PERSONAL_ROWS.NOTES, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth);
    notesRange.setWrap(true);

    this._applyWeekendColors(sheet, daysInMonth, daysOfWeek);
    this._applyBorders(sheet, daysInMonth);
  },

  _applyWeekendColors(sheet, daysInMonth, daysOfWeek) {
    const settings = SettingsManager.getSettings();

    for (let i = 0; i < daysInMonth; i++) {
      const col = CONFIG.PERSONAL_ROWS.START_COL + i;
      const day = i + 1;
      const isHoliday = this._checkHoliday(day, settings.targetMonth);
      const cellRange = sheet.getRange(CONFIG.PERSONAL_ROWS.DATE, col, 2, 1);

      if (daysOfWeek[i] === "土") {
        cellRange.setBackground(CONFIG.COLORS.SATURDAY_BG)
                 .setFontColor(CONFIG.COLORS.HOLIDAY_TEXT);
      } else if (daysOfWeek[i] === "日" || isHoliday) {
        cellRange.setBackground(CONFIG.COLORS.SUNDAY_HOLIDAY_BG)
                 .setFontColor(CONFIG.COLORS.HOLIDAY_TEXT);
      }
    }
  },

  _checkHoliday(day, month) {
    return DateUtils.isHoliday(day, month);
  },

  _applyBorders(sheet, daysInMonth) {
    const shiftRange = sheet.getRange(
      CONFIG.PERSONAL_ROWS.DATE,
      1,
      8,
      CONFIG.PERSONAL_ROWS.START_COL + daysInMonth - 1
    );

    shiftRange.setBorder(
      true, true, true, true, true, true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID
    );
  },

  _createDateColumnMap(sheet) {
    const settings = SettingsManager.getSettings();
    const daysInMonth = new Date(settings.targetYear, settings.targetMonth, 0).getDate();

    const dateHeaders = sheet.getRange(
      CONFIG.PERSONAL_ROWS.DATE,
      CONFIG.PERSONAL_ROWS.START_COL,
      1,
      daysInMonth
    ).getValues()[0];

    const map = {};
    for (let i = 0; i < dateHeaders.length; i++) {
      const dateValue = dateHeaders[i];
      if (dateValue) {
        const day = dateValue instanceof Date ? dateValue.getDate() : String(dateValue);
        map[String(day)] = CONFIG.PERSONAL_ROWS.START_COL + i;
      }
    }

    return map;
  },

  _saveExistingData(sheet, dateColumnMap, newData) {
    const existingNotes = {};
    const existingHours = {};
    const settings = SettingsManager.getSettings();
    const daysInMonth = new Date(settings.targetYear, settings.targetMonth, 0).getDate();

    const newDataMap = {};
    for (const item of newData) {
      newDataMap[item.date] = {
        projectName: item.projectName,
        hours: item.hours
      };
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const colIndex = dateColumnMap[String(day)];
      if (!colIndex) continue;

      // 補足事項を保存
      const note = sheet.getRange(CONFIG.PERSONAL_ROWS.NOTES, colIndex).getValue();
      if (note) {
        existingNotes[day] = note;
      }

      // 稼働時間を保存（手動入力を保持）
      const existingHour = sheet.getRange(CONFIG.PERSONAL_ROWS.HOURS, colIndex).getValue();
      const newDataForDay = newDataMap[day];

      if (existingHour && typeof existingHour === 'string' && existingHour.trim() !== '') {
        // 既存の稼働時間がある場合
        if (newDataForDay) {
          const newHour = newDataForDay.hours || '';

          // 手動入力の判定：
          // 1. 座学は常に保持（座学の稼働時間は手動入力）
          // 2. 新しいデータの稼働時間と異なる場合は手動入力と判断して保持
          if (newDataForDay.projectName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU ||
              existingHour !== newHour) {
            existingHours[day] = existingHour;
          }
        } else {
          // 新データがない場合も保持
          existingHours[day] = existingHour;
        }
      }
    }

    return {
      notes: existingNotes,
      hours: existingHours
    };
  },

  _isSystemMessage(message) {
    if (!message) return false;
    const trimmed = message.trim();
    return trimmed === CONFIG.SYSTEM_MESSAGES.NEED_TIME_CONFIRMATION ||
           trimmed === CONFIG.SYSTEM_MESSAGES.NEED_TRAINER_CONFIRMATION ||
           trimmed === CONFIG.SYSTEM_MESSAGES.OJT_LABEL;
  },
};

// ========================================
// マスターシート管理
// ========================================
const MasterSheetManager = {
  initializeMasterSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let masterSheet = ss.getSheetByName(CONFIG.SHEETS.MASTER);

    if (masterSheet) {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        "確認",
        "マスターシートは既に存在します。\n初期化しますか？（既存データは削除されます）",
        ui.ButtonSet.YES_NO
      );

      if (response !== ui.Button.YES) {
        return;
      }

      ss.deleteSheet(masterSheet);
    }

    // マスターシート作成
    masterSheet = ss.insertSheet(CONFIG.SHEETS.MASTER);
    this._setupMasterSheet(masterSheet);

    // ID管理シート作成
    this._createIdManagementSheet(ss);

    // 個別案件設定シート作成
    this._createCustomProjectSheet(ss);

    // 店舗名称マスターシート作成
    this._createStoreNameMasterSheet(ss);

    Utils.showAlert(
      "初期設定完了",
      "以下のシートを作成しました：\n" +
      "✓ マスターシート\n" +
      "✓ ID管理シート\n" +
      "✓ 個別案件設定シート\n" +
      "✓ 店舗名称マスターシート\n\n" +
      "次の手順：\n" +
      "1. ID管理シートに固定メンバーを登録\n" +
      "2. マスターシートのG2にフォルダIDを入力\n" +
      "3. マスターシートのG5で転記対象月を選択\n" +
      "4. 店舗名称マスターに店舗情報を登録\n" +
      "5. マスターシート更新を実行"
    );

    ss.setActiveSheet(masterSheet);
  },

  /**
   * マスターシートの初期設定
   * @private
   * @param {Sheet} sheet マスターシート
   */
  _setupMasterSheet(sheet) {
    // ヘッダー行の設定
    const headers = ["選択", "名前", "スプレッドシートID", "最終更新日", "エラー"];
    sheet.getRange(CONFIG.MASTER_SETTINGS.HEADER_ROW, 1, 1, CONFIG.MASTER_COLUMNS.TOTAL_COLUMNS)
      .setValues([headers])
      .setFontWeight("bold")
      .setBackground(CONFIG.COLORS.HEADER_BG)
      .setHorizontalAlignment("center");

    // フォルダIDラベルの設定
    sheet.getRange(CONFIG.MASTER_SETTINGS.FOLDER_ID_LABEL_ROW, CONFIG.MASTER_SETTINGS.FOLDER_ID_LABEL_COL)
      .setValue("元シフト表フォルダID")
      .setFontWeight("bold")
      .setBackground(CONFIG.COLORS.FOLDER_ID_BG);

    // フォルダID入力欄の背景色
    sheet.getRange(CONFIG.MASTER_SETTINGS.FOLDER_ID_ROW, CONFIG.MASTER_SETTINGS.FOLDER_ID_COL)
      .setBackground(CONFIG.COLORS.FOLDER_ID_BG);

    // 月選択プルダウンラベル
    sheet.getRange(
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_LABEL_ROW,
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_LABEL_COL
    )
      .setValue("転記対象月")
      .setFontWeight("bold")
      .setBackground(CONFIG.COLORS.FOLDER_ID_BG);

    // プルダウン初期設定
    this._setupMonthDropdown(sheet);

    // 列幅設定
    this._setColumnWidths(sheet);

    // ヘッダー罫線
    const headerRange = sheet.getRange(CONFIG.MASTER_SETTINGS.HEADER_ROW, 1, 1, CONFIG.MASTER_COLUMNS.TOTAL_COLUMNS);
    headerRange.setBorder(
      true, true, true, true, null, null,
      CONFIG.COLORS.BORDER,
      SpreadsheetApp.BorderStyle.SOLID
    );

    // 使い方の説明
    this._addUsageInstructions(sheet);
  },

  /**
   * マスターシートの列幅を設定
   * @private
   * @param {Sheet} sheet マスターシート
   */
  _setColumnWidths(sheet) {
    sheet.setColumnWidth(CONFIG.MASTER_COLUMNS.CHECKBOX, CONFIG.COLUMN_WIDTHS.MASTER_CHECKBOX);
    sheet.setColumnWidth(CONFIG.MASTER_COLUMNS.NAME, CONFIG.COLUMN_WIDTHS.MASTER_NAME);
    sheet.setColumnWidth(CONFIG.MASTER_COLUMNS.SHEET_ID, CONFIG.COLUMN_WIDTHS.MASTER_SHEET_ID);
    sheet.setColumnWidth(CONFIG.MASTER_COLUMNS.LAST_UPDATE, CONFIG.COLUMN_WIDTHS.MASTER_LAST_UPDATE);
    sheet.setColumnWidth(CONFIG.MASTER_COLUMNS.ERROR_MESSAGE, CONFIG.COLUMN_WIDTHS.MASTER_ERROR);

    // プルダウン列の幅
    sheet.setColumnWidth(CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_COL, CONFIG.COLUMN_WIDTHS.MONTH_DROPDOWN);
  },

  /**
   * 使い方の説明を追加
   * @private
   * @param {Sheet} sheet マスターシート
   */
  _addUsageInstructions(sheet) {
    const usageCol = CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_COL;
    const usageStartRow = CONFIG.MASTER_SETTINGS.USAGE_START_ROW;
    const instructions = [
      "【使い方】",
      "1. G2にフォルダIDを入力",
      "2. G5のプルダウンで転記対象月を選択",
      "3. A列のチェックで転記対象を選択",
      "4. メニューから「チェックした人を転記」を実行"
    ];

    sheet.getRange(usageStartRow, usageCol).setValue(instructions[0]).setFontWeight("bold");
    for (let i = 1; i < instructions.length; i++) {
      sheet.getRange(usageStartRow + i, usageCol).setValue(instructions[i]).setFontStyle("italic");
    }
  },

  /**
   * 月選択プルダウンを設定
   * @private
   * @param {Sheet} sheet マスターシート
   */
  _setupMonthDropdown(sheet) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // 今月
    const thisMonth = `${currentYear}年${currentMonth}月`;

    // 来月
    let nextYear = currentYear;
    let nextMonth = currentMonth + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear = currentYear + 1;
    }
    const nextMonthStr = `${nextYear}年${nextMonth}月`;

    // プルダウンを設定
    const cell = sheet.getRange(
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_ROW,
      CONFIG.MASTER_SETTINGS.MONTH_DROPDOWN_COL
    );

    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList([thisMonth, nextMonthStr], true)
      .setAllowInvalid(false)
      .build();

    cell.setDataValidation(rule);

    // 重要: 文字列フォーマットを設定（この行を追加）
    cell.setNumberFormat('@STRING@');

    cell.setValue(thisMonth);  // デフォルトで今月を選択
    cell.setBackground(CONFIG.COLORS.FOLDER_ID_BG);

    Logger.log(`月プルダウンを設定しました: ${thisMonth}, ${nextMonthStr}`);
  },

  _createIdManagementSheet(ss) {
    let sheet = ss.getSheetByName(CONFIG.SHEETS.ID_MANAGEMENT);

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet(CONFIG.SHEETS.ID_MANAGEMENT);

    // ヘッダー作成
    const headers = ["名前", "スプレッドシートID"];
    sheet.getRange(CONFIG.ID_MANAGEMENT.HEADER_ROW, 1, 1, 2)
      .setValues([headers])
      .setFontWeight("bold")
      .setBackground("#E8F0FE")
      .setHorizontalAlignment("center");

    // 列幅設定
    sheet.setColumnWidth(1, 150);  // A列: 名前
    sheet.setColumnWidth(2, 400);  // B列: スプレッドシートID

    // サンプルデータ
    const sampleData = [
      ["山田太郎", ""],
      ["佐藤花子", ""],
      ["鈴木一郎", ""]
    ];
    sheet.getRange(CONFIG.ID_MANAGEMENT.DATA_START_ROW, 1, 3, 2).setValues(sampleData);

    // 使い方をD列以降に記載
    const usageCol = CONFIG.ID_MANAGEMENT.USAGE_START_COL;
    const usageRow = CONFIG.ID_MANAGEMENT.USAGE_START_ROW;

    sheet.getRange(usageRow, usageCol).setValue("【使い方】").setFontWeight("bold");
    sheet.getRange(usageRow + 1, usageCol).setValue("1. 固定メンバーの名前とスプレッドシートIDを登録してください").setFontStyle("italic");
    sheet.getRange(usageRow + 2, usageCol).setValue("2. IDが空欄の場合はオレンジ色で表示されます").setFontStyle("italic");
    sheet.getRange(usageRow + 3, usageCol).setValue("3. 同名の人がいる場合はオレンジ色で表示されます").setFontStyle("italic");
    sheet.getRange(usageRow + 4, usageCol).setValue("4. マスターシート更新時に自動的にIDが転記されます").setFontStyle("italic");

    sheet.setColumnWidth(usageCol, 400);

    Logger.log("ID管理シートを作成しました");
  },

  _createCustomProjectSheet(ss) {
    let sheet = ss.getSheetByName(CONFIG.CUSTOM_PROJECTS_SHEET_NAME);

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet(CONFIG.CUSTOM_PROJECTS_SHEET_NAME);

    const headers = ["案件名", "会場", "内容", "稼働時間", "同時入店スタッフ", "適用条件"];
    sheet.getRange(1, 1, 1, 6)
      .setValues([headers])
      .setFontWeight("bold")
      .setBackground("#E8F0FE")
      .setHorizontalAlignment("center");

    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 100);

    const sampleData = [
      ["希望休", "", "", "", "", ""],
      ["公休", "", "", "", "", ""],
      ["△", "", "", "", "", ""],
      ["座学", "東船橋事務所", "研修", "", "", ""],
      ["OJT", "", "", "", "", ""],
      ["出", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ];
    sheet.getRange(2, 1, 7, 6).setValues(sampleData);

    sheet.getRange(9, 1).setValue("【使い方】");
    sheet.getRange(10, 1).setValue("1. リソースシートに登録されていない案件を追加できます");
    sheet.getRange(11, 1).setValue("2. 適用条件：「平日」「土日祝」または空欄（常に適用）");
    sheet.getRange(12, 1).setValue("3. 同じ案件名で複数行登録すると、条件に応じて自動選択されます");

    sheet.getRange(9, 1, 4, 1).setFontStyle("italic").setFontColor("#666666");

    Logger.log("個別案件設定シートを作成しました");
  },

  /**
   * 店舗名称マスターシートを作成
   * @private
   * @param {Spreadsheet} ss スプレッドシート
   */
  _createStoreNameMasterSheet(ss) {
    let sheet = ss.getSheetByName(CONFIG.STORE_NAME_MASTER_SHEET_NAME);

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet(CONFIG.STORE_NAME_MASTER_SHEET_NAME);

    // ヘッダー作成
    const headers = ["略称", "正式名称", "備考"];
    sheet.getRange(CONFIG.STORE_NAME_MASTER.HEADER_ROW, 1, 1, 3)
      .setValues([headers])
      .setFontWeight("bold")
      .setBackground("#E8F0FE")
      .setHorizontalAlignment("center");

    // 列幅設定
    sheet.setColumnWidth(1, 200);  // A列: 略称
    sheet.setColumnWidth(2, 250);  // B列: 正式名称
    sheet.setColumnWidth(3, 200);  // C列: 備考

    // サンプルデータ
    const sampleData = [
      ["テラス湘南(店)", "DSテラスモール湘南店", ""],
      ["カインズ行田", "DSカインズ行田店", ""],
      ["イオン成田", "DSイオンモール成田店", ""],
    ];
    sheet.getRange(CONFIG.STORE_NAME_MASTER.DATA_START_ROW, 1, 3, 3).setValues(sampleData);

    // 使い方をD列以降に記載
    sheet.getRange(2, 4).setValue("【使い方】").setFontWeight("bold");
    sheet.getRange(3, 4).setValue("1. 略称に元シフト表の案件名（番号なし）を入力").setFontStyle("italic");
    sheet.getRange(4, 4).setValue("2. 正式名称に転記時に使用する店舗名を入力").setFontStyle("italic");
    sheet.getRange(5, 4).setValue("3. 「店頭ヘルパー」と「軒先販売」の会場名に反映されます").setFontStyle("italic");
    sheet.getRange(6, 4).setValue("4. 部分一致で検索されます（例: 「テラス湘南」で「テラス湘南①②③」全てに適用）").setFontStyle("italic");

    sheet.setColumnWidth(4, 500);

    Logger.log("店舗名称マスターシートを作成しました");
  },

  updateMasterSheet() {
    try {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        "マスターシート更新",
        "マスターシートを再構築します。\n\n" +
        "・元シフト表から名前を取得\n" +
        "・ID管理シートからIDを自動転記\n" +
        "・既存データは全て削除されます\n\n" +
        "続行しますか?",
        ui.ButtonSet.YES_NO
      );

      if (response !== ui.Button.YES) {
        return;
      }

      // 元シフト表から名前を取得
      const allNames = DataAccess.getNamesFromSourceSheet();

      if (allNames.length === 0) {
        Utils.showAlert(
          "エラー",
          "元シフト表から有効な名前を取得できませんでした。\n\n名前は「姓　名」の形式(文字と文字の間にスペース)である必要があります。"
        );
        return;
      }

      // ID管理シートから固定メンバー情報を取得
      const idMap = DataAccess.getIdManagementData();

      // マスターシートを取得
      const masterSheet = this._getMasterSheetForUpdate();

      // マスターシートのデータ部分を全削除
      this._clearMasterData(masterSheet);

      // 元シフト表の名前でマスターシートを再構築
      this._rebuildMasterSheet(masterSheet, allNames, idMap);

      // ID管理シートのチェック（色付け）
      this._checkIdManagementSheet(idMap);

      let message = `マスターシートを更新しました。\n\n元シフト表から取得: ${allNames.length}名\n`;

      let idMatchCount = 0;
      for (const name of allNames) {
        if (idMap[name] && idMap[name] !== "") {
          idMatchCount++;
        }
      }
      message += `ID自動転記: ${idMatchCount}名\n`;
      message += `ID未設定: ${allNames.length - idMatchCount}名\n\n`;

      if (allNames.length > idMatchCount) {
        message += "ID未設定のメンバーには手動でIDを入力してください。";
      }

      Utils.showAlert("更新完了", message);
    } catch (error) {
      Logger.log(`マスターシート更新エラー: ${error.message}`);
      Utils.showAlert(
        "エラー",
        `マスターシート更新中にエラーが発生しました:\n${error.message}`
      );
    }
  },

  _getMasterSheetForUpdate() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.MASTER);

    if (!sheet) {
      throw new Error(
        "マスターシートが見つかりません。\n\n" +
        "先に「⚙️ マスター初期設定」を実行してください。"
      );
    }

    return sheet;
  },

  _clearMasterData(sheet) {
    const lastRow = sheet.getLastRow();

    if (lastRow >= CONFIG.MASTER_SETTINGS.DATA_START_ROW) {
      const rowsToDelete = lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1;
      sheet.getRange(
        CONFIG.MASTER_SETTINGS.DATA_START_ROW,
        1,
        rowsToDelete,
        5
      ).clearContent();

      Logger.log(`マスターシートの既存データを削除しました（${rowsToDelete}行）`);
    }
  },

  _rebuildMasterSheet(sheet, names, idMap) {
    const startRow = CONFIG.MASTER_SETTINGS.DATA_START_ROW;
    const data = [];

    for (const name of names) {
      const sheetId = idMap[name] || "";
      data.push([false, name, sheetId, "", ""]);
    }

    if (data.length > 0) {
      sheet.getRange(startRow, 1, data.length, 5).setValues(data);

      // チェックボックスを設定
      const checkboxRange = sheet.getRange(startRow, CONFIG.MASTER_COLUMNS.CHECKBOX, data.length, 1);
      checkboxRange.insertCheckboxes();

      Logger.log(`${data.length}名のメンバーをマスターシートに追加しました`);
    }
  },

  _checkIdManagementSheet(idMap) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.ID_MANAGEMENT);

    if (!sheet) {
      Logger.log("ID管理シートが見つかりません");
      return;
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < CONFIG.ID_MANAGEMENT.DATA_START_ROW) return;

    const dataRange = sheet.getRange(
      CONFIG.ID_MANAGEMENT.DATA_START_ROW,
      1,
      lastRow - CONFIG.ID_MANAGEMENT.DATA_START_ROW + 1,
      2
    );

    const values = dataRange.getValues();
    const backgrounds = [];
    const nameCounts = {};

    // 同名チェック
    for (const [name] of values) {
      if (name && name.toString().trim() !== "") {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    }

    // 背景色を設定
    for (const [name, sheetId] of values) {
      let rowColor = ["#FFFFFF", "#FFFFFF"];

      if (name && name.toString().trim() !== "") {
        // ID未入力の場合
        if (!sheetId || sheetId.toString().trim() === "") {
          rowColor = [CONFIG.ID_MANAGEMENT.WARNING_COLOR, CONFIG.ID_MANAGEMENT.WARNING_COLOR];
        }
        // 同名がある場合
        else if (nameCounts[name] > 1) {
          rowColor = [CONFIG.ID_MANAGEMENT.WARNING_COLOR, CONFIG.ID_MANAGEMENT.WARNING_COLOR];
        }
      }

      backgrounds.push(rowColor);
    }

    dataRange.setBackgrounds(backgrounds);
    Logger.log("ID管理シートの色付けを実行しました");
  },
};

// ========================================
// 高速化されたビジネスロジック層の改善版
// ========================================
const ShiftTransferController = {
  _cache: null,

  // 一括転記（高速版 - 改善）
  executeBatchTransfer(names) {
    try {
      Logger.log("=== データ一括取得開始 ===");
      const startTime = new Date().getTime();

      this._cache = this._buildCacheOptimized(names);

      const cacheTime = new Date().getTime();
      Logger.log(`データ取得完了: ${(cacheTime - startTime) / 1000}秒`);

      const results = [];
      for (const name of names) {
        try {
          const count = this._executePersonalTransferWithCache(name);
          results.push({ name, success: true, count });
          Logger.log(`✓ ${name}: 転記成功 (${count}件)`);
        } catch (error) {
          results.push({ name, success: false, error: error.message });
          Logger.log(`✗ ${name}: ${error.message}`);
        }
      }

      const endTime = new Date().getTime();
      Logger.log(`=== 処理完了: ${(endTime - startTime) / 1000}秒 ===`);

      this._cache = null;
      return results;
    } catch (error) {
      this._cache = null;
      throw error;
    }
  },

  // 最適化されたキャッシュ構築
  _buildCacheOptimized(names) {
    const sourceId = SettingsManager.findSourceSpreadsheet();
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceId);

    Logger.log("元シフト表を開く...");

    const shiftSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.SHIFT);
    const resourceSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.RESOURCE);
    const storeSheet = sourceSpreadsheet.getSheetByName(CONFIG.SHEETS.STORE);

    if (!shiftSheet) {
      throw new Error(`「${CONFIG.SHEETS.SHIFT}」シートが見つかりません`);
    }

    Logger.log("全データを一括取得中...");

    // シフトシートの全データを一括取得
    const lastRow = shiftSheet.getLastRow();
    const lastCol = shiftSheet.getLastColumn();
    const startCol = CONFIG.SHIFT_COLUMNS.DATA_START;

    const allShiftData = shiftSheet.getRange(1, 1, lastRow, lastCol).getValues();
    const allShiftBackgrounds = shiftSheet.getRange(1, 1, lastRow, lastCol).getBackgrounds();

    const dateHeaders = allShiftData[CONFIG.SHIFT_COLUMNS.DATE_ROW - 1].slice(startCol - 1);

    // 名前とニックネームのマップを構築
    const nameRowMap = {};
    const nicknameMap = {};

    for (let i = CONFIG.SHIFT_COLUMNS.NAME_START_ROW - 1; i < lastRow; i++) {
      const name = allShiftData[i][CONFIG.SHIFT_COLUMNS.NAME - 1];
      if (name && typeof name === "string" && name.trim() !== "") {
        const processedName = Utils.preprocessName(name);
        if (processedName && Utils.isValidName(processedName)) {
          nameRowMap[processedName] = i;

          const nickname = allShiftData[i][CONFIG.SHIFT_COLUMNS.NICKNAME - 1];
          if (nickname) {
            nicknameMap[processedName] = nickname;
          }
        }
      }
    }

    Logger.log("リソースデータを取得中...");

    // リソースデータを最適化して取得
    let resourceData = null;
    let resourceMap = {};
    if (resourceSheet) {
      const resourceLastRow = resourceSheet.getLastRow();
      if (resourceLastRow >= 2) {
        const resourceRawData = resourceSheet.getRange(2, 1, resourceLastRow - 1, 6).getValues();

        // マージセル処理を最適化
        const hoursMap = this._getMergedCellMapOptimized(resourceSheet, 2, 5, resourceLastRow - 1);
        const scheduleMap = this._getMergedCellMapOptimized(resourceSheet, 2, 6, resourceLastRow - 1);

        resourceData = {
          data: resourceRawData,
          hoursMap,
          scheduleMap
        };

        resourceMap = this._buildResourceMapOptimized(resourceRawData, hoursMap, scheduleMap);
      }
    }

    Logger.log("店舗別データを取得中...");

    // 店舗別データを一括取得
    let storeData = null;
    if (storeSheet) {
      const storeLastRow = storeSheet.getLastRow();
      const storeLastCol = storeSheet.getLastColumn();

      if (storeLastRow >= CONFIG.STORE_CONFIG.DATA_START_ROW) {
        storeData = {
          names: storeSheet.getRange(
            CONFIG.STORE_CONFIG.DATA_START_ROW,
            CONFIG.STORE_CONFIG.NAME_COL,
            storeLastRow - CONFIG.STORE_CONFIG.DATA_START_ROW + 1,
            1
          ).getValues(),
          dateHeaders: storeSheet.getRange(
            CONFIG.STORE_CONFIG.DATE_ROW,
            CONFIG.STORE_CONFIG.DATA_START_COL,
            1,
            storeLastCol - CONFIG.STORE_CONFIG.DATA_START_COL + 1
          ).getValues()[0],
          staffData: storeSheet.getRange(
            CONFIG.STORE_CONFIG.DATA_START_ROW,
            CONFIG.STORE_CONFIG.DATA_START_COL,
            storeLastRow - CONFIG.STORE_CONFIG.DATA_START_ROW + 1,
            storeLastCol - CONFIG.STORE_CONFIG.DATA_START_COL + 1
          ).getValues()
        };
      }
    }

    Logger.log("全OJTデータを最適化構築中...");

    // OJTデータを最適化して構築
    const allOJTData = this._buildAllOJTDataOptimized(
      allShiftData,
      allShiftBackgrounds,
      dateHeaders,
      nameRowMap,
      startCol
    );

    Logger.log("カスタムプロジェクトデータをキャッシュ中...");

    // カスタムプロジェクトデータを事前にキャッシュ
    const customProjectsData = this._loadCustomProjectsData();

    Logger.log("メンバー情報をキャッシュ中...");

    // メンバー情報を事前にキャッシュ（全員分）
    const memberInfoMap = this._loadMemberInfoMap(names);

    Logger.log("スプレッドシートキャッシュを初期化中...");

    // スプレッドシートオブジェクトのキャッシュ
    const spreadsheetCache = {};

    return {
      sourceId,
      dateHeaders,
      allShiftData,
      allShiftBackgrounds,
      nameRowMap,
      nicknameMap,
      resourceData,
      resourceMap,
      storeData,
      allOJTData,
      startCol,
      customProjectsData,
      memberInfoMap,
      spreadsheetCache
    };
  },

  // リソースマップ構築の最適化
  _buildResourceMapOptimized(resourceData, hoursMap, scheduleMap) {
    const resourceMap = {};

    for (let i = 0; i < resourceData.length; i++) {
      const rowNum = i + 2;
      const projectName = resourceData[i][1];

      if (projectName) {
        if (!resourceMap[projectName]) {
          resourceMap[projectName] = [];
        }

        const hours = hoursMap[rowNum] || resourceData[i][4];
        const scheduleText = scheduleMap[rowNum] || resourceData[i][5];

        resourceMap[projectName].push({
          hours,
          scheduleText,
        });
      }
    }

    return resourceMap;
  },

  // マージセル処理の最適化
  _getMergedCellMapOptimized(sheet, startRow, col, numRows) {
    const range = sheet.getRange(startRow, col, numRows, 1);
    const values = range.getValues();
    const map = {};

    // 通常の値を先に登録
    for (let i = 0; i < values.length; i++) {
      if (values[i][0]) {
        map[startRow + i] = values[i][0];
      }
    }

    // マージされたセルを一括処理
    const mergedRanges = range.getMergedRanges();
    for (const mergedRange of mergedRanges) {
      const value = mergedRange.getValue();
      const rangeStartRow = mergedRange.getRow();
      const numMergedRows = mergedRange.getNumRows();

      // マージされた範囲の全行に値を設定
      for (let k = 0; k < numMergedRows; k++) {
        map[rangeStartRow + k] = value;
      }
    }

    return map;
  },

  // カスタムプロジェクトデータを一度に読み込む
  _loadCustomProjectsData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const customSheet = ss.getSheetByName(CONFIG.CUSTOM_PROJECTS_SHEET_NAME);

    if (!customSheet) return [];

    const lastRow = customSheet.getLastRow();
    if (lastRow < 2) return [];

    const data = customSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    return data.map(row => ({
      projectName: row[0],
      venue: row[1] || "",
      content: row[2] || "",
      hours: row[3] || "",
      staff: row[4] || "",
      condition: row[5] ? row[5].toString().trim() : ""
    }));
  },

  // メンバー情報を一括取得
  _loadMemberInfoMap(names) {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MASTER);
    if (!masterSheet) return {};

    const lastRow = masterSheet.getLastRow();
    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) return {};

    const data = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1,
      2
    ).getValues();

    const settings = SettingsManager.getSettings();
    const targetSheetName = String(settings.targetYear).slice(2) + String(settings.targetMonth).padStart(2, "0");

    const memberInfoMap = {};
    for (let i = 0; i < data.length; i++) {
      const name = data[i][0];
      const sheetId = data[i][1];
      if (name) {
        memberInfoMap[name] = {
          name,
          sheetId,
          targetSheetName
        };
      }
    }

    return memberInfoMap;
  },

  // OJTデータ構築の最適化（色インデックスマップを使用）
  _buildAllOJTDataOptimized(allShiftData, allShiftBackgrounds, dateHeaders, nameRowMap, startCol) {
    const allOJTData = [];

    // 色ごとのトレーナー情報をキャッシュ（日付×色でキー）
    const colorToTrainerCache = {};

    for (const processedName in nameRowMap) {
      const rowIndex = nameRowMap[processedName];
      const projectData = allShiftData[rowIndex].slice(startCol - 1);

      for (let i = 0; i < dateHeaders.length; i++) {
        const day = Utils.extractDay(dateHeaders[i]);
        if (day && projectData[i] === "OJT") {
          const colIndex = startCol + i;
          const backgroundColor = allShiftBackgrounds[rowIndex][colIndex - 1];

          // キャッシュキー: 日付-色
          const cacheKey = `${day}-${backgroundColor}`;

          // キャッシュから取得、なければ検索
          if (!colorToTrainerCache[cacheKey]) {
            colorToTrainerCache[cacheKey] = this._findTrainerByColorOptimized(
              allShiftData,
              allShiftBackgrounds,
              backgroundColor,
              colIndex,
              nameRowMap
            );
          }

          const trainerInfo = colorToTrainerCache[cacheKey];

          // 自分がトレーナーでないことを確認
          if (trainerInfo && trainerInfo.name !== processedName) {
            allOJTData.push({
              traineeName: processedName,
              date: day,
              trainerInfo
            });
          } else if (!trainerInfo) {
            allOJTData.push({
              traineeName: processedName,
              date: day,
              trainerInfo: null
            });
          }
        }
      }
    }

    return allOJTData;
  },

  // トレーナー検索の最適化
  _findTrainerByColorOptimized(allShiftData, allShiftBackgrounds, targetColor, targetCol, nameRowMap) {
    // 全メンバーから色が一致する最初の人を探す
    for (const processedName in nameRowMap) {
      const rowIndex = nameRowMap[processedName];
      const cellColor = allShiftBackgrounds[rowIndex][targetCol - 1];

      if (cellColor === targetColor) {
        const projectName = allShiftData[rowIndex][targetCol - 1];
        if (projectName && projectName !== "OJT") {
          return { name: processedName, projectName };
        }
      }
    }

    return null;
  },

  // 個人転記の最適化版
  _executePersonalTransferWithCache(name) {
    const cache = this._cache;

    // キャッシュからメンバー情報を取得（高速化）
    const memberInfo = cache.memberInfoMap[name];
    if (!memberInfo) {
      this._recordError(name, `「${name}」の情報がマスターシートに見つかりません`);
      throw new Error(`「${name}」の情報がマスターシートに見つかりません`);
    }

    if (!memberInfo.sheetId || memberInfo.sheetId.trim() === "") {
      this._recordError(name, "スプレッドシートIDが未設定です");
      throw new Error("スプレッドシートIDが未設定です");
    }

    let shiftData = this._getPersonalShiftDataFromCache(name, cache);

    if (shiftData.length === 0) {
      this._recordError(name, `「${name}」のシフトデータが見つかりませんでした`);
      throw new Error(`「${name}」のシフトデータが見つかりませんでした`);
    }

    const enrichResult = this._enrichWithResourceDataFromCache(shiftData, cache);
    shiftData = enrichResult.data;

    if (enrichResult.errors.length > 0) {
      this._recordError(name, enrichResult.errors.join("\n"));
    }

    const ojtData = this._processOJTDataFromCache(name, cache);
    shiftData = shiftData.concat(ojtData);

    shiftData = this._addCoworkersInfoFromCache(shiftData, name, cache);
    shiftData = this._addOJTTraineesInfoFromCache(shiftData, name, cache);

    let personalSheet;
    try {
      // スプレッドシートのキャッシュを使用（高速化）
      personalSheet = this._ensureSheetWithCache(
        memberInfo.sheetId,
        memberInfo.targetSheetName,
        name,
        cache
      );
    } catch (error) {
      if (error.message.indexOf("見つかりません") !== -1 || error.message.indexOf("アクセス") !== -1) {
        this._recordError(name, "個人シートにアクセスできません（権限エラー）");
      } else {
        this._recordError(name, `個人シートエラー: ${error.message}`);
      }
      throw error;
    }

    const transferCount = this._transferDataOptimizedWithCache(personalSheet, shiftData, cache);

    this._updateLastUpdateDate(name);

    if (enrichResult.errors.length === 0) {
      this._clearError(name);
    }

    return transferCount;
  },

  // その他のヘルパーメソッドは既存コードと同じ
  _getPersonalShiftDataFromCache(name, cache) {
    const rowIndex = cache.nameRowMap[name];
    if (rowIndex === undefined) {
      return [];
    }

    const projectData = cache.allShiftData[rowIndex].slice(cache.startCol - 1);
    const shiftData = [];

    for (let i = 0; i < cache.dateHeaders.length; i++) {
      const day = Utils.extractDay(cache.dateHeaders[i]);
      if (day) {
        shiftData.push({
          date: day,
          projectName: projectData[i] || "",
          colIndex: cache.startCol + i,
        });
      }
    }

    return shiftData;
  },

  _enrichWithResourceDataFromCache(shiftData, cache) {
    const errors = [];
    const result = [];

    for (const item of shiftData) {
      if (item.projectName === "座学") {
        result.push({
          date: item.date,
          projectName: item.projectName,
          content: "研修",
          venue: "東船橋事務所",
          hours: "",
          hasResourceData: true,
        });
        continue;
      }

      const resourceInfo = cache.resourceMap[item.projectName];

      if (resourceInfo && resourceInfo.length > 0) {
        result.push(BusinessLogic._enrichShiftItem(item, cache.resourceMap));
        continue;
      }

      // キャッシュからカスタムプロジェクトデータを取得（高速化）
      const customProject = this._getCustomProjectFromCache(item.projectName, item.date, cache);
      if (customProject) {
        result.push({
          date: item.date,
          projectName: customProject.projectName,
          venue: customProject.venue,
          content: customProject.content,
          hours: customProject.hours,
          coworkers: customProject.staff,
          hasResourceData: true,
        });
        continue;
      }

      errors.push(`${item.date}日: 案件「${item.projectName}」が見つかりません`);

      result.push({
        date: item.date,
        projectName: item.projectName,
        venue: "",
        content: "",
        hours: "",
        hasResourceData: false,
      });
    }

    return { data: result, errors };
  },

  _processOJTDataFromCache(name, cache) {
    const processedOJT = [];
    const ojtItems = [];

    for (const item of cache.allOJTData) {
      if (item.traineeName === name) {
        ojtItems.push(item);
      }
    }

    for (const ojtItem of ojtItems) {
      if (ojtItem.trainerInfo) {
        const trainerProjectName = ojtItem.trainerInfo.projectName;
        const resourceInfo = cache.resourceMap[trainerProjectName];

        let hours = "";
        let venue = "";
        let scheduleText = "";

        if (resourceInfo && resourceInfo.length > 0) {
          hours = BusinessLogic._extractWorkingHours(resourceInfo[0].hours, ojtItem.date);
          scheduleText = resourceInfo[0].scheduleText;

          const venues = BusinessLogic._extractVenuesFromSchedule(scheduleText, ojtItem.date);

          if (venues.length > 0) {
            venue = venues[0];
          }

          if (!venue || venue.indexOf("軒先") !== -1 || venue.indexOf("ヘルパー") !== -1 || venue.indexOf("店頭") !== -1) {
            venue = BusinessLogic._getProjectBaseName(trainerProjectName);
          }
        }

        const trainerNickname = cache.nicknameMap[ojtItem.trainerInfo.name] || ojtItem.trainerInfo.name;

        processedOJT.push({
          date: ojtItem.date,
          projectName: trainerProjectName,
          content: BusinessLogic._determineContent(trainerProjectName, scheduleText, ojtItem.date),
          venue,
          hours,
          hasResourceData: true,
          isOJT: true,
          trainerName: ojtItem.trainerInfo.name,
          coworkers: trainerNickname,
        });
      } else {
        processedOJT.push({
          date: ojtItem.date,
          projectName: "",
          content: "",
          venue: "",
          hours: "",
          hasResourceData: false,
          isOJT: true,
          trainerName: null,
          needsTrainerConfirmation: true,
        });
      }
    }

    return processedOJT;
  },

  _addCoworkersInfoFromCache(shiftData, selectedName, cache) {
    const targetNickname = cache.nicknameMap[selectedName];

    if (!targetNickname || !cache.storeData) {
      return shiftData;
    }

    const dateColMap = {};
    for (let i = 0; i < cache.storeData.dateHeaders.length; i++) {
      const day = Utils.extractDay(cache.storeData.dateHeaders[i]);
      if (day) {
        dateColMap[day] = i;
      }
    }

    const result = [];
    for (const item of shiftData) {
      const newItem = { ...item };

      if (item.isOJT && item.coworkers) {
        newItem.coworkers = item.coworkers;
      } else if (item.projectName) {
        newItem.coworkers = BusinessLogic._findCoworkersFromCache(
          item.projectName,
          item.date,
          targetNickname,
          cache.storeData.names,
          cache.storeData.staffData,
          dateColMap
        );
      } else {
        newItem.coworkers = "";
      }

      result.push(newItem);
    }

    return result;
  },

  _addOJTTraineesInfoFromCache(shiftData, trainerName, cache) {
    const traineesByDate = {};

    for (const ojtItem of cache.allOJTData) {
      if (ojtItem.trainerInfo && ojtItem.trainerInfo.name === trainerName) {
        const traineeNickname = cache.nicknameMap[ojtItem.traineeName] || ojtItem.traineeName;

        if (!traineesByDate[ojtItem.date]) {
          traineesByDate[ojtItem.date] = [];
        }
        traineesByDate[ojtItem.date].push(traineeNickname);
      }
    }

    const result = [];
    for (const item of shiftData) {
      const newItem = { ...item };

      if (traineesByDate[item.date]) {
        const existingCoworkers = newItem.coworkers || "";
        const trainees = traineesByDate[item.date].sort().join("・");

        if (existingCoworkers) {
          newItem.coworkers = `${existingCoworkers}・${trainees}`;
        } else {
          newItem.coworkers = trainees;
        }
      }

      result.push(newItem);
    }

    return result;
  },

  // キャッシュからカスタムプロジェクトデータを取得
  _getCustomProjectFromCache(projectName, date, cache) {
    const settings = SettingsManager.getSettings();
    const isWeekendOrHoliday = Utils.isWeekendOrHoliday(date, settings.targetYear, settings.targetMonth);

    let noConditionMatch = null;

    for (const project of cache.customProjectsData) {
      if (project.projectName === projectName) {
        if (project.condition === "平日" && !isWeekendOrHoliday) {
          return project;
        } else if (project.condition === "土日祝" && isWeekendOrHoliday) {
          return project;
        } else if (!project.condition && !noConditionMatch) {
          noConditionMatch = project;
        }
      }
    }

    return noConditionMatch;
  },

  // スプレッドシートキャッシュを使用してシートを取得（高速化）
  _ensureSheetWithCache(sheetId, targetSheetName, selectedName, cache) {
    // スプレッドシートをキャッシュから取得または新規に開く
    if (!cache.spreadsheetCache[sheetId]) {
      cache.spreadsheetCache[sheetId] = SpreadsheetApp.openById(sheetId);
    }
    const personalSpreadsheet = cache.spreadsheetCache[sheetId];

    let personalSheet = personalSpreadsheet.getSheetByName(targetSheetName);

    if (!personalSheet) {
      personalSheet = personalSpreadsheet.insertSheet(targetSheetName);
      PersonalSheetManager._createHeaders(personalSheet, selectedName);
      PersonalSheetManager._generateDateHeaders(personalSheet);
    } else {
      personalSheet.getRange(3, 1).setValue(selectedName).setFontWeight("bold");
    }

    personalSheet.setFrozenRows(CONFIG.PERSONAL_ROWS.DAY_OF_WEEK);
    personalSheet.setFrozenColumns(1);

    return personalSheet;
  },

  // キャッシュを使用した高速データ転記
  _transferDataOptimizedWithCache(sheet, data, cache) {
    const settings = SettingsManager.getSettings();
    const daysInMonth = new Date(settings.targetYear, settings.targetMonth, 0).getDate();

    // 日付カラムマップを作成
    const dateHeaders = sheet.getRange(
      CONFIG.PERSONAL_ROWS.DATE,
      CONFIG.PERSONAL_ROWS.START_COL,
      1,
      daysInMonth
    ).getValues()[0];

    const dateColumnMap = {};
    for (let i = 0; i < dateHeaders.length; i++) {
      const dateValue = dateHeaders[i];
      if (dateValue) {
        const day = dateValue instanceof Date ? dateValue.getDate() : String(dateValue);
        dateColumnMap[String(day)] = CONFIG.PERSONAL_ROWS.START_COL + i;
      }
    }

    // 既存の補足事項と稼働時間を一括取得（高速化）
    const existingData = this._saveExistingDataFast(sheet, dateColumnMap, data, daysInMonth);

    // データを日付順にソート
    data.sort((a, b) => a.date - b.date);

    // 各行のデータ配列を準備
    const projectRow = new Array(daysInMonth).fill("");
    const venueRow = new Array(daysInMonth).fill("");
    const contentRow = new Array(daysInMonth).fill("");
    const hoursRow = new Array(daysInMonth).fill("");
    const staffRow = new Array(daysInMonth).fill("");
    const notesRow = new Array(daysInMonth).fill("");
    const backgrounds = [];
    for (let i = 0; i < 6; i++) {
      backgrounds.push(new Array(daysInMonth).fill("#FFFFFF"));
    }

    let transferCount = 0;

    // データを配列に格納
    for (const item of data) {
      const colIndex = dateColumnMap[String(item.date)];

      if (!colIndex) continue;

      const arrayIndex = colIndex - CONFIG.PERSONAL_ROWS.START_COL;

      if (item.projectName) {
        projectRow[arrayIndex] = item.projectName;

        // 色設定
        const projectNameLower = item.projectName.toLowerCase().trim();
        const color = CONFIG.PROJECT_COLORS[projectNameLower];
        if (color) {
          for (let j = 0; j < 5; j++) {
            backgrounds[j][arrayIndex] = color;
          }
        }
      }

      if (item.hasResourceData && item.venue) {
        venueRow[arrayIndex] = item.venue;
      }

      if (item.content) {
        contentRow[arrayIndex] = item.content;
      }

      // 稼働時間の処理（手動入力を優先）
      const existingHours = existingData.hours[item.date];
      if (existingHours) {
        hoursRow[arrayIndex] = existingHours;
      } else if (item.projectName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU) {
        hoursRow[arrayIndex] = "";
        notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.NEED_TIME_CONFIRMATION;
      } else if (item.hasResourceData && item.hours) {
        hoursRow[arrayIndex] = item.hours;
      }

      if (item.coworkers) {
        staffRow[arrayIndex] = item.coworkers;
      }

      // OJT処理（補足事項の設定）
      if (item.isOJT) {
        if (item.needsTrainerConfirmation) {
          notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.NEED_TRAINER_CONFIRMATION;
        } else {
          notesRow[arrayIndex] = CONFIG.SYSTEM_MESSAGES.OJT_LABEL;
        }
      }

      transferCount++;
    }

    // 手動コメントを復元
    for (const day in existingData.notes) {
      const colIndex = dateColumnMap[day];
      if (!colIndex) continue;

      const arrayIndex = colIndex - CONFIG.PERSONAL_ROWS.START_COL;
      const note = existingData.notes[day];

      // システムメッセージが設定されていない場合のみ復元
      if (!notesRow[arrayIndex] && !PersonalSheetManager._isSystemMessage(note)) {
        notesRow[arrayIndex] = note;
      }
    }

    // 一括書き込み
    const dataToWrite = [
      projectRow,
      venueRow,
      contentRow,
      hoursRow,
      staffRow,
      notesRow
    ];

    sheet.getRange(
      CONFIG.PERSONAL_ROWS.PROJECT,
      CONFIG.PERSONAL_ROWS.START_COL,
      6,
      daysInMonth
    ).setValues(dataToWrite).setBackgrounds(backgrounds);

    return transferCount;
  },

  // 既存データを高速に読み込む
  _saveExistingDataFast(sheet, dateColumnMap, newData, daysInMonth) {
    const existingNotes = {};
    const existingHours = {};

    // 新しいデータのマップを作成
    const newDataMap = {};
    for (const item of newData) {
      newDataMap[item.date] = {
        projectName: item.projectName,
        hours: item.hours
      };
    }

    // 補足事項と稼働時間を一括取得（高速化）
    const notesRange = sheet.getRange(CONFIG.PERSONAL_ROWS.NOTES, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth);
    const hoursRange = sheet.getRange(CONFIG.PERSONAL_ROWS.HOURS, CONFIG.PERSONAL_ROWS.START_COL, 1, daysInMonth);

    const notesValues = notesRange.getValues()[0];
    const hoursValues = hoursRange.getValues()[0];

    for (let day = 1; day <= daysInMonth; day++) {
      const colIndex = dateColumnMap[String(day)];
      if (!colIndex) continue;

      const arrayIndex = colIndex - CONFIG.PERSONAL_ROWS.START_COL;

      // 補足事項を保存
      const note = notesValues[arrayIndex];
      if (note) {
        existingNotes[day] = note;
      }

      // 稼働時間を保存（手動入力を保持）
      const existingHour = hoursValues[arrayIndex];
      const newDataForDay = newDataMap[day];

      if (existingHour && typeof existingHour === 'string' && existingHour.trim() !== '') {
        if (newDataForDay) {
          const newHour = newDataForDay.hours || '';

          if (newDataForDay.projectName === CONFIG.SPECIAL_PROJECTS.ZAKUGAKU ||
              existingHour !== newHour) {
            existingHours[day] = existingHour;
          }
        } else {
          existingHours[day] = existingHour;
        }
      }
    }

    return {
      notes: existingNotes,
      hours: existingHours
    };
  },

  _updateLastUpdateDate(name) {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MASTER);
    if (!masterSheet) return;

    const lastRow = masterSheet.getLastRow();
    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) return;

    const names = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1,
      1
    ).getValues();

    for (let i = 0; i < names.length; i++) {
      if (names[i][0] === name) {
        const now = new Date();
        const dateStr = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd HH:mm");
        masterSheet.getRange(i + CONFIG.MASTER_SETTINGS.DATA_START_ROW, CONFIG.MASTER_COLUMNS.LAST_UPDATE).setValue(dateStr);
        break;
      }
    }
  },

  _recordError(name, errorMessage) {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MASTER);
    if (!masterSheet) return;

    const lastRow = masterSheet.getLastRow();
    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) return;

    const names = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1,
      1
    ).getValues();

    for (let i = 0; i < names.length; i++) {
      if (names[i][0] === name) {
        masterSheet.getRange(i + CONFIG.MASTER_SETTINGS.DATA_START_ROW, CONFIG.MASTER_COLUMNS.ERROR_MESSAGE).setValue(errorMessage);
        break;
      }
    }
  },

  _clearError(name) {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MASTER);
    if (!masterSheet) return;

    const lastRow = masterSheet.getLastRow();
    if (lastRow < CONFIG.MASTER_SETTINGS.DATA_START_ROW) return;

    const names = masterSheet.getRange(
      CONFIG.MASTER_SETTINGS.DATA_START_ROW,
      CONFIG.MASTER_COLUMNS.NAME,
      lastRow - CONFIG.MASTER_SETTINGS.DATA_START_ROW + 1,
      1
    ).getValues();

    for (let i = 0; i < names.length; i++) {
      if (names[i][0] === name) {
        masterSheet.getRange(i + CONFIG.MASTER_SETTINGS.DATA_START_ROW, CONFIG.MASTER_COLUMNS.ERROR_MESSAGE).setValue("");
        break;
      }
    }
  },
};

// ========================================
// UI関数(メニューから呼び出し)
// ========================================

/**
 * チェックされたメンバーを転記（メニューから呼び出し）
 *
 * @function transferCheckedMembers
 * @returns {void}
 */
function transferCheckedMembers() {
  try {
    const checkedMembers = DataAccess.getCheckedMembers();

    if (checkedMembers.length === 0) {
      Utils.showAlert("エラー", "転記対象が選択されていません。\nA列のチェックボックスにチェックを入れてください。");
      return;
    }

    // 確認ダイアログを表示
    if (!_showTransferConfirmation(checkedMembers)) {
      return;
    }

    // 一括転記を実行
    const results = ShiftTransferController.executeBatchTransfer(checkedMembers);

    // 結果を表示
    _showTransferResults(results);
  } catch (error) {
    Logger.log(`エラー: ${error.message}`);
    Utils.showAlert("エラー", `転記中にエラーが発生しました:\n${error.message}`);
  }
}

/**
 * 転記確認ダイアログを表示
 *
 * @private
 * @function _showTransferConfirmation
 * @param {Array<string>} members - メンバー名の配列
 * @returns {boolean} OKの場合true
 */
function _showTransferConfirmation(members) {
  const ui = SpreadsheetApp.getUi();
  let message;

  if (members.length === 1) {
    message = `${members[0]}さんのシフトを転記します。\n\n本当に転記してよろしいですか？`;
  } else {
    message = "以下のメンバーのシフトを転記します：\n\n";
    const displayCount = Math.min(members.length, CONFIG.MAX_PREVIEW_COUNT);
    for (let i = 0; i < displayCount; i++) {
      message += `・${members[i]}\n`;
    }
    if (members.length > CONFIG.MAX_PREVIEW_COUNT) {
      message += `...他${members.length - CONFIG.MAX_PREVIEW_COUNT}名\n`;
    }
    message += `\n合計 ${members.length}名\n\n本当に転記してよろしいですか？`;
  }

  const response = ui.alert("確認", message, ui.ButtonSet.YES_NO);
  return response === ui.Button.YES;
}

/**
 * 転記結果を表示
 *
 * @private
 * @function _showTransferResults
 * @param {Array<{name: string, success: boolean, error?: string}>} results - 転記結果の配列
 * @returns {void}
 */
function _showTransferResults(results) {
  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const result of results) {
    if (result.success) {
      successCount++;
    } else {
      failCount++;
      errors.push(`${result.name}: ${result.error}`);
    }
  }

  let resultMessage = `転記完了\n\n成功: ${successCount}名\n失敗: ${failCount}名`;

  if (errors.length > 0) {
    const displayErrors = Math.min(errors.length, CONFIG.MAX_ERROR_DISPLAY);
    resultMessage += `\n\n【エラー詳細】\n${errors.slice(0, displayErrors).join("\n")}`;
    if (errors.length > CONFIG.MAX_ERROR_DISPLAY) {
      resultMessage += `\n...他${errors.length - CONFIG.MAX_ERROR_DISPLAY}件`;
    }
  }

  Utils.showAlert("転記完了", resultMessage);
}

/**
 * マスターシート更新（メニューから呼び出し）
 *
 * @function updateMasterSheet
 * @returns {void}
 */
function updateMasterSheet() {
  MasterSheetManager.updateMasterSheet();
}

/**
 * マスター初期設定（メニューから呼び出し）
 *
 * @function initializeMasterSheet
 * @returns {void}
 */
function initializeMasterSheet() {
  MasterSheetManager.initializeMasterSheet();
}