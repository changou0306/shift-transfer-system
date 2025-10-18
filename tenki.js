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
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("📋 シフト転記システム")
    .addItem("✅ チェックした人を転記", "transferCheckedMembers")
    .addSeparator()
    .addItem("📄 マスターシート更新", "updateMasterSheet")
    .addItem("🔄 月プルダウン更新", "updateMonthDropdown")
    .addItem("⚙️ マスター初期設定", "initializeMasterSheet")
    .addToUi();
}

/**
 * 月プルダウンを更新（メニューから呼び出し）
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
    if (dateValue instanceof Date) {
      return dateValue.getDate();
    }
    if (typeof dateValue === "string") {
      const match = dateValue.match(/(\d+)\/(\d+)/);
      return match ? parseInt(match[2]) : null;
    }
    return null;
  },

  isWeekendOrHoliday(day, year, month) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dateStr = `${month}/${day}`;
    const isHoliday = CONFIG.HOLIDAYS_2025.indexOf(dateStr) !== -1;
    return dayOfWeek === 0 || dayOfWeek === 6 || isHoliday;
  },

  normalizeTimeFormat(timeStr) {
    return timeStr.replace(/[\-~～]/g, "〜");
  },

  extractBaseName(projectName) {
    return projectName.replace(/[①②③④⑤⑥⑦⑧⑨⑩]+$/g, "");
  },

  preprocessName(name) {
    if (!name || typeof name !== "string") return "";
    const trimmedName = name.trim();
    if (trimmedName === "") return "";
    const processedName = trimmedName.replace(/^[^）)]*[）)]\s*/, "");
    return processedName.trim();
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
    if (!projectName) return "";
    return projectName.replace(/[①②③④⑤⑥⑦⑧⑨⑩]+$/g, "").trim();
  },

  /**
   * スケジュールテキストから特定日付の内容を抽出
   * @private
   * @param {string} scheduleText スケジュールテキスト（F列）
   * @param {number} targetDate 対象日付
   * @return {string} 内容（見つからない場合は空文字）
   */
  _extractContentFromSchedule(scheduleText, targetDate) {
    if (!scheduleText) return "";

    const contents = [];

    // 改行で分割
    const lines = scheduleText.split(/\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // パターンA: 内容名：月/日付範囲（内容名に日本語が含まれ、行頭から始まる）
      // 例：店頭ヘルパー：11/1〜3
      const contentFirstPattern = /^([ぁ-んァ-ヶ一-龠々〆〤ヵヶa-zA-Z]+[^：:\d]*?)\s*[：:]\s*(\d+)\/([^：:\n]+?)(?:\s*[：:]|$)/;
      const contentMatch = trimmed.match(contentFirstPattern);

      if (contentMatch) {
        const contentName = contentMatch[1].trim();
        const month = parseInt(contentMatch[2]);
        const dateRange = contentMatch[3];

        // 日付の前に「：」がある場合は除外
        const fullDateRange = `${month}/${dateRange}`.split(/[：:]/)[0];

        // 日付範囲を展開
        const dates = this._expandDatesFromRange(fullDateRange);

        if (dates.indexOf(targetDate) !== -1) {
          contents.push(contentName);
        }

        // このlineの処理は完了（次のlineへ）
        continue;
      }

      // パターンAでマッチしなかった場合は、既存のロジックで処理
      // 月ごとに分割
      const mainSegments = trimmed.split(/(?=\d+\/)/);

      for (const segment of mainSegments) {
        const seg = segment.trim();
        if (!seg) continue;

        // 月を抽出
        let month = null;

        let monthMatch = seg.match(/^(\d+)\//);
        if (monthMatch) {
          month = parseInt(monthMatch[1]);
        }

        if (!month) {
          monthMatch = seg.match(/(\d+)\//);
          if (monthMatch) {
            month = parseInt(monthMatch[1]);
          }
        }

        if (!month) continue;

        const patterns = this._extractDateContentPatterns(seg, month);

        for (const pattern of patterns) {
          const dates = this._expandDatesFromRange(pattern.dateRange);

          if (dates.indexOf(targetDate) !== -1) {
            const contentName = pattern.content.trim();
            if (contentName) {
              contents.push(contentName);
            }
          }
        }
      }
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

        const cleanContent = this._cleanContentText(content);

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

          const cleanContent = this._cleanContentText(content);

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
            const cleanContent = this._cleanContentText(content);

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
   * 内容テキストから余計な情報を除去
   * @private
   * @param {string} contentText 内容テキスト
   * @return {string} クリーンな内容テキスト
   */
  _cleanContentText(contentText) {
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

  

  _extractVenuesFromSchedule(scheduleText, targetDate) {
    if (!scheduleText) return [];

    const venues = [];

    // 改行で分割
    const lines = scheduleText.split(/\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // パターンA: 会場名：月/日付範囲（会場名に日本語が含まれ、行頭から始まる）
      // 例：ベイシア香取小見川：11/1〜3
      const venueFirstPattern = /^([ぁ-んァ-ヶ一-龠々〆〤ヵヶa-zA-Z]+[^：:\d]*?)\s*[：:]\s*(\d+)\/([^：:\n]+?)(?:\s*[：:]|$)/;
      const venueMatch = trimmed.match(venueFirstPattern);

      if (venueMatch) {
        const venueName = venueMatch[1].trim();
        const month = parseInt(venueMatch[2]);
        const dateRange = venueMatch[3];

        // 日付の前に「：」がある場合は除外（例：「日：11/1」のような誤マッチを防ぐ）
        const fullDateRange = `${month}/${dateRange}`.split(/[：:]/)[0];

        // 日付範囲を展開
        const dates = this._expandDatesFromRange(fullDateRange);

        if (dates.indexOf(targetDate) !== -1) {
          venues.push(venueName);
        }

        // このlineの処理は完了（次のlineへ）
        continue;
      }

      // パターンAでマッチしなかった場合は、既存のロジックで処理
      // 月ごとに分割
      const mainSegments = trimmed.split(/(?=\d+\/)/);

      for (const segment of mainSegments) {
        const seg = segment.trim();
        if (!seg) continue;

        // 月を抽出
        let month = null;
        let monthMatch = seg.match(/^(\d+)\//);
        if (monthMatch) {
          month = parseInt(monthMatch[1]);
        }

        if (!month) {
          monthMatch = seg.match(/(\d+)\//);
          if (monthMatch) {
            month = parseInt(monthMatch[1]);
          }
        }

        if (!month) continue;

        const patterns = this._extractDateVenuePatterns(seg, month);

        for (const pattern of patterns) {
          const dates = this._expandDatesFromRange(pattern.dateRange);

          if (dates.indexOf(targetDate) !== -1) {
            const venueName = pattern.venue.trim();
            if (venueName && !/^[\d\s\-\u007E\u301C\u30FC\uFF5E〜・]+$/.test(venueName)) {
              venues.push(venueName);
            }
          }
        }
      }
    }

    return venues;
  },

  _extractDateVenuePatterns(segment, month) {
    const patterns = [];

    try {
      // パターン1: 日付→会場名（既存ロジック）
      // 例: 10/3,6-7：テラス湘南
      const withMonthPattern = /(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\n]+?)(?=\s*[：:]|\s*\d+名|\n|$)/g;
      let match;

      while ((match = withMonthPattern.exec(segment)) !== null) {
        const dateRange = match[1];
        const venue = match[2].trim();

        const cleanVenue = venue
          .replace(/[：:].*$/, '')
          .replace(/＋[^：:（）()]*$/, '')
          .replace(/\s*\d+名.*$/, '')
          .trim();

        if (cleanVenue && cleanVenue.length > 0) {
          patterns.push({
            dateRange,
            venue: cleanVenue,
          });
        }
      }

      // パターン2: 会場名→日付（新規ロジック - 修正版）
      // パターン1で見つからなかった場合のみ実行
      if (patterns.length === 0) {
        // 月が含まれるパターン: ベイシア香取小見川：11/1〜3
        const venueFirstWithMonthPattern = /([^：:\d\n]+?)\s*[：:]\s*(\d+\/[\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)/g;

        while ((match = venueFirstWithMonthPattern.exec(segment)) !== null) {
          const venue = match[1].trim();
          const dateRange = match[2];

          const cleanVenue = venue
            .replace(/[：:].*$/, '')
            .replace(/＋[^：:（）()]*$/, '')
            .replace(/\s*\d+名.*$/, '')
            .trim();

          if (cleanVenue && cleanVenue.length > 0) {
            patterns.push({
              dateRange,
              venue: cleanVenue,
            });
          }
        }
      }

      // パターン3: 月なし日付範囲：会場名（既存ロジック）
      if (patterns.length === 0) {
        const withoutMonthPattern = /(?:^|\s)([\d\-\u007E\u301C\u30FC\uFF5E.,〜～、・]+)\s*[：:]\s*([^：:\d]+?)(?=[：:]|\d+[\/\-]|$)/g;

        while ((match = withoutMonthPattern.exec(segment)) !== null) {
          const dateText = match[1].trim();
          if (!/\//.test(dateText) && /[\d]/.test(dateText)) {
            const venue = match[2].trim();
            const cleanVenue = venue
              .replace(/[：:].*$/, '')
              .replace(/＋[^：:（）()]*$/, '')
              .replace(/\s*\d+名.*$/, '')
              .trim();

            if (cleanVenue && cleanVenue.length > 0) {
              patterns.push({
                dateRange: `${month}/${dateText}`,
                venue: cleanVenue,
              });
            }
          }
        }
      }
    } catch (e) {
      Logger.log(`会場名抽出エラー: ${e.message}, segment: ${segment}`);
    }

    return patterns;
  },

  _expandDatesFromRange(dateRangeText) {
    const dates = [];
    const monthMatch = dateRangeText.match(/(\d+)\//);

    if (!monthMatch) return dates;

    const daysText = dateRangeText.replace(/\d+\//, "");

    // 複数の区切り文字で分割（カンマ、読点、ピリオド、中黒）
    // 重要: 範囲記号（〜～-）は区切り文字に含めない
    const parts = daysText.split(/[,、.・]/);

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // 範囲指定（例: 1-4, 1〜4, 1～4）
      const rangeMatch = trimmed.match(/^(\d+)[\-〜~～](\d+)$/);

      if (rangeMatch) {
        const startDay = parseInt(rangeMatch[1]);
        const endDay = parseInt(rangeMatch[2]);
        for (let day = startDay; day <= endDay; day++) {
          if (dates.indexOf(day) === -1) {
            dates.push(day);
          }
        }
      } else {
        // 単一日付（例: 1, 2, 3）
        const singleMatch = trimmed.match(/^(\d+)$/);
        if (singleMatch) {
          const singleDay = parseInt(singleMatch[1]);
          if (dates.indexOf(singleDay) === -1) {
            dates.push(singleDay);
          }
        }
      }
    }

    return dates.sort((a, b) => a - b);
  },

  _extractWorkingHours(hoursText, targetDate) {
    if (!hoursText || typeof hoursText !== "string") return "";

    const settings = SettingsManager.getSettings();
    const normalized = hoursText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
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
    const daysInMonth = new Date(settings.targetYear, settings.targetMonth, 0).getDate();
    const dates = [];
    const daysOfWeek = [];
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(settings.targetYear, settings.targetMonth - 1, day);
      dates.push(day);
      daysOfWeek.push(dayNames[date.getDay()]);
    }

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
    const dateStr = `${month}/${day}`;
    return CONFIG.HOLIDAYS_2025.indexOf(dateStr) !== -1;
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
 * @private
 * @param {Array<string>} members メンバー名の配列
 * @return {boolean} OKの場合true
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
 * @private
 * @param {Array} results 転記結果の配列
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
 */
function updateMasterSheet() {
  MasterSheetManager.updateMasterSheet();
}

/**
 * マスター初期設定（メニューから呼び出し）
 */
function initializeMasterSheet() {
  MasterSheetManager.initializeMasterSheet();
}