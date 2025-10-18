# BusinessLogic モジュール構造分析

## 現状分析

BusinessLogicモジュールは約70のメソッドを持ち、以下の責務を担っています。

### メソッド分類（責務別）

#### 1. リソース情報取得・マッピング (9メソッド)
- `enrichWithResourceData()` - リソース情報を付加
- `_buildResourceMap()` - リソースマップ構築
- `_buildResourceMapOptimized()` - 最適化版リソースマップ構築
- `_enrichShiftItem()` - シフトアイテム拡張
- `_getOfficialStoreName()` - 公式店舗名取得
- `_getProjectBaseName()` - プロジェクトベース名取得
- `_getCustomProjectFromCache()` - カスタムプロジェクトキャッシュ取得
- `_loadCustomProjectsData()` - カスタムプロジェクトデータロード
- `_enrichWithResourceDataFromCache()` - キャッシュからリソース情報付加

**モジュール化提案**: `ResourceEnrichment` モジュール

#### 2. スケジュール抽出処理 (10メソッド)
- `_extractFromSchedule()` - 統合版スケジュール抽出
- `_extractContentFromSchedule()` - 内容抽出
- `_extractContentFromSchedule_OLD()` - 内容抽出（旧版）
- `_extractVenuesFromSchedule()` - 会場抽出
- `_extractVenuesFromSchedule_OLD()` - 会場抽出（旧版）
- `_extractDateContentPatterns()` - 日付→内容パターン抽出
- `_extractDateVenuePatterns()` - 日付→会場パターン抽出
- `_determineContent()` - 内容判定
- `_expandDatesFromRange()` - 日付範囲展開
- `_extractWorkingHours()` - 稼働時間抽出

**モジュール化提案**: `ScheduleParser` モジュール

#### 3. 同僚・OJT情報処理 (6メソッド)
- `addCoworkersInfo()` - 同僚情報追加
- `_findCoworkersFromCache()` - キャッシュから同僚検索
- `_addCoworkersInfoFromCache()` - キャッシュから同僚情報追加
- `addOJTTraineesInfo()` - OJT訓練生情報追加
- `_buildAllOJTDataOptimized()` - OJTデータ一括構築
- `_addOJTTraineesInfoFromCache()` - キャッシュからOJT情報追加
- `_findTrainerByColorOptimized()` - 色からトレーナー検索
- `_processOJTDataFromCache()` - キャッシュからOJTデータ処理

**モジュール化提案**: `CoworkerOJTManager` モジュール

#### 4. シート操作・データ転記 (15メソッド)
- `ensureSheetOptimized()` - シート最適化
- `transferDataOptimized()` - データ転記最適化版
- `_createHeaders()` - ヘッダー作成
- `_generateDateHeaders()` - 日付ヘッダー生成
- `_applyWeekendColors()` - 週末色適用
- `_checkHoliday()` - 祝日チェック
- `_applyBorders()` - 罫線適用
- `_createDateColumnMap()` - 日付列マップ作成
- `_saveExistingData()` - 既存データ保存
- `_saveExistingDataFast()` - 既存データ高速保存
- `_isSystemMessage()` - システムメッセージ判定
- `_ensureSheetWithCache()` - キャッシュ使用シート確保
- `_transferDataOptimizedWithCache()` - キャッシュ使用データ転記
- `_getMergedCellMapOptimized()` - 結合セルマップ取得

**モジュール化提案**: `SheetFormatter` モジュール

#### 5. マスターシート管理 (12メソッド)
- `initializeMasterSheet()` - マスター初期設定
- `_setupMasterSheet()` - マスターシート設定
- `_setColumnWidths()` - 列幅設定
- `_addUsageInstructions()` - 使い方説明追加
- `_setupMonthDropdown()` - 月プルダウン設定
- `_createIdManagementSheet()` - ID管理シート作成
- `_createCustomProjectSheet()` - カスタムプロジェクトシート作成
- `_createStoreNameMasterSheet()` - 店舗名称マスターシート作成
- `updateMasterSheet()` - マスターシート更新
- `_getMasterSheetForUpdate()` - 更新用マスターシート取得
- `_clearMasterData()` - マスターデータクリア
- `_rebuildMasterSheet()` - マスターシート再構築
- `_checkIdManagementSheet()` - ID管理シート確認

**モジュール化提案**: `MasterSheetManager` モジュール（既存）に統合

#### 6. 一括転記処理 (10メソッド)
- `executeBatchTransfer()` - 一括転記実行
- `_buildCacheOptimized()` - キャッシュ構築最適化
- `_loadMemberInfoMap()` - メンバー情報マップロード
- `_executePersonalTransferWithCache()` - キャッシュ使用個人転記
- `_getPersonalShiftDataFromCache()` - キャッシュから個人シフトデータ取得
- `_updateLastUpdateDate()` - 最終更新日更新
- `_recordError()` - エラー記録
- `_clearError()` - エラークリア

**モジュール化提案**: `BatchTransferController` モジュール

#### 7. 店舗名称マスター処理 (2メソッド)
現在SettingsManagerに配置:
- `getStoreNameMaster()` - 店舗名称マスター取得

BusinessLogic内:
- `_getOfficialStoreName()` - 公式店舗名取得

**モジュール化提案**: `StoreNameMaster` モジュール

## モジュール化の優先順位

### Phase 3a: 高優先度（独立性が高い）

1. **StoreNameMaster モジュール** ⭐⭐⭐
   - 責務が明確
   - 他モジュールへの依存が少ない
   - 2メソッドのみで管理しやすい
   - 効果: 店舗名変換ロジックの集約

2. **ScheduleParser モジュール** ⭐⭐⭐
   - スケジュール抽出ロジックの集約
   - 10メソッドを統合
   - 効果: F列解析ロジックの一元管理

3. **CoworkerOJTManager モジュール** ⭐⭐
   - 同僚・OJT処理の集約
   - 8メソッドを統合
   - 効果: 協業情報管理の明確化

### Phase 3b: 中優先度（既存モジュールとの統合）

4. **SheetFormatter モジュール** ⭐⭐
   - シート整形処理の集約
   - 15メソッドを統合
   - 効果: UI層の分離

5. **ResourceEnrichment モジュール** ⭐
   - リソース情報付加処理の集約
   - 9メソッドを統合
   - 効果: データ拡張ロジックの明確化

### Phase 3c: 低優先度（大規模リファクタリング）

6. **BatchTransferController モジュール** ⭐
   - 既にShiftTransferControllerが存在
   - 重複を避けるため慎重に統合
   - 効果: 転記フロー全体の最適化

## 依存関係分析

```
┌─────────────────┐
│  UI Functions   │
│  (Menu calls)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ShiftTransferController            │
│  ├─ executeBatchTransfer            │
│  └─ _buildCacheOptimized            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  BusinessLogic (70 methods)         │
│  ├─ ResourceEnrichment (9)          │
│  ├─ ScheduleParser (10)             │
│  ├─ CoworkerOJTManager (8)          │
│  ├─ SheetFormatter (15)             │
│  ├─ BatchTransfer (10)              │
│  └─ MasterSheet (12)                │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  DataAccess                         │
│  ├─ getResourceData                 │
│  ├─ getCustomProjectData            │
│  └─ getStaffData                    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Google Sheets API                  │
└─────────────────────────────────────┘
```

## Phase 3 実装計画

### ステップ1: StoreNameMaster モジュール作成
- SettingsManager.getStoreNameMaster() を移動
- BusinessLogic._getOfficialStoreName() を移動
- キャッシング機構の追加
- テスト追加（5-8テスト）

### ステップ2: ScheduleParser モジュール作成
- _extractFromSchedule() を中心に10メソッド移動
- _patterns をScheduleParserに移動
- 依存関係の整理
- テスト追加（15-20テスト）

### ステップ3: CoworkerOJTManager モジュール作成
- addCoworkersInfo() など8メソッド移動
- OJT処理の最適化
- テスト追加（10-15テスト）

### ステップ4: 統合テスト
- 転記フロー全体のテスト
- パフォーマンステスト
- リグレッションテスト

## 期待される効果

### コード品質
- BusinessLogicの行数: 2500行 → 1500行（-40%）
- メソッド数: 70 → 30-40（-40-50%）
- モジュールの責務明確化

### 保守性
- 各モジュールが独立してテスト可能
- 変更の影響範囲が限定的
- 新機能追加が容易

### パフォーマンス
- StoreNameMasterのキャッシング: +10-20%向上
- ScheduleParserの最適化: +5-10%向上

### テストカバレッジ
- 現在: 52テスト（Phase 2完了）
- Phase 3後: 90-110テスト（+40-60テスト）
