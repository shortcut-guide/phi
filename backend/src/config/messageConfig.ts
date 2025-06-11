export const messages = {
  passwordReset1: 'リセットリンクを送信しました',
  passwordReset2: 'リセットリンクは1時間有効です',
  passwordReset3: 'リセットリンクは無効です',
  ErrorMail1: 'メールアドレスが登録されていません',
  ErrorMail2: 'メール送信中にエラーが発生しました',
  ErrorMail3: 'メールアドレスは必須です',
  ErrorPasswordReset1: 'リセット処理中にエラーが発生しました',
  utilsD1:{
    ja:{
      ErrorSITE_DB: 'D1 クライアントがバインドされていません (SITE_DB が未定義)',
      ErrorSEARCHLOGS_DB: 'D1 クライアントがバインドされていません (SEARCHLOGS_DB が未定義)',
      ErrorPROFILE_DB: 'D1 クライアントがバインドされていません (PROFILE_DB が未定義)',
      ErrorPRODUCTS_DB: 'D1 クライアントがバインドされていません (PRODUCTS_DB が未定義)'
    },
    en:{
      ErrorSITE_DB: 'D1 client is not bound (SITE_DB is undefined)',
      ErrorSEARCHLOGS_DB: 'D1 client is not bound (SEARCHLOGS_DB is undefined)',
      ErrorPROFILE_DB: 'D1 client is not bound (PROFILE_DB is undefined)',
      ErrorPRODUCTS_DB: 'D1 client is not bound (PRODUCTS_DB is undefined)'
    }
  },
  searchClient:{
    ja: {
      ErrorSearch: '商品検索に失敗しました',
      ErrorSuggest: 'サジェスト取得に失敗しました'
    },
    en: {
      ErrorSearch: 'Failed to search products',
      ErrorSuggest: 'Failed to fetch suggestions'
    }
  },
  api: {
    sites: {
      fetchError: {
        ja: 'データの取得に失敗しました。',
      },
      validateTitleUrl: {
        ja: 'title と url は必須です。',
      },
      insertError: {
        ja: 'データの追加に失敗しました。',
      },
      notFound: {
        ja: 'サイトが見つかりません。',
      },
      updateError: {
        ja: 'データの更新に失敗しました。',
      },
      noUpdateData: {
        ja: '更新するデータが見つかりません。',
      },
      updateSuccess: {
        ja: '更新成功',
      },
      deleteError: {
        ja: 'データの削除に失敗しました。',
      },
      deleteNotFound: {
        ja: '削除するデータが見つかりません。',
      },
      deleteSuccessPrefix: {
        ja: '削除成功: ',
      },
    }
  }
};