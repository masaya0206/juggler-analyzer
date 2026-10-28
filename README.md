# Juggler Analyzer 初期版

GitHub Pages + Supabase Auth/Postgres で動作する個人用Webアプリです。Replit、Vercelは不要です。

## セットアップ

1. Supabase で新規プロジェクトを作成。
2. Supabase の **SQL Editor** で `schema.txt` の全文を実行。
3. Supabase の **Authentication > Providers > Email** で、必要に応じて一般の新規サインアップを無効化。自分のユーザーを **Authentication > Users** から作成（メール確認等の状態を確認）。
4. Supabase の **Project URL** と **Publishable key**（または legacy anon key）を `config.js` に設定。`service_role` や secret key は絶対に入力しない。
5. このフォルダのファイルをGitHubのリポジトリのルートへアップロード。
6. GitHub の **Settings > Pages > Build and deployment > Deploy from a branch**、`main` と `/(root)` を指定して公開。
7. 発行されたURLをiPhoneのSafariで開き、ログイン後にホーム画面に追加。

## 利用

- `機種設定`：各設定のBB/RB分母を入力して保存（デフォルト値はありません）。
- `取込`：日付・店舗・機種を入力してCSV/JSONを貼り付け、プレビュー・保存。
- `設定分析`：登録済み台と機種モデルから相対尤度を算出。

### CSV 入力例

```csv
台番号,総回転数,BB,RB
501,6240,24,22
502,7810,32,29
```

### JSON 入力例

```json
[{"台番号":"501","総回転数":6240,"BB":24,"RB":22}]
```

これらは**架空の例**です。Safariショートカットから実際に出力されたデータ形式との接続は未調整であり、ショートカットからの自動送信も未実装です。

## セキュリティ上の注意

- GitHub PagesのHTML/CSS/JSは公開されます。ログインしないとデータを読めないようにするのはSupabase Auth + RLSの役割です。サイト自体は非公開にはなりません。
- 個人データを守るため、`schema.txt` のRLS設定が必要です。
- Publishable keyは公開向けで問題ありませんが、秘密鍵・DBパスワードをコミットしないこと。
- GitHub PagesはHTTPサーバー処理を実行できません。今回はSupabase APIへブラウザから直接接続します。
- 外部サイトの自動収集・利用条件は別途確認してください。
- 数値の推定は、機種ごとの当選率が一定、各ゲームの結果が独立、BB/RB/非ボーナスが排他的、設定1〜6の事前確率が等しいと仮定した近似値です。実際の当選仕様・事前情報・設定変更は反映していません。勝率ではありません。
- 1000件を超える台データは最新1000件まで表示します。履歴検索、ページ送り、削除・訂正UIは今後の改修項目です。
