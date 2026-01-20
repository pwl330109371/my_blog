export const useArticle = () => {
    const getArticleList = (params: any, fetchOptions: any = {}) => {
        return useApi('/article/getArticleList', {
            method: 'GET',
            params,
            ...fetchOptions
        })
    }

    const getArticleDetail = (params: any, fetchOptions: any = {}) => {
        return useApi('/article/getArticleDetail', {
            method: 'GET',
            params,
            ...fetchOptions
        })
    }

    // 兼容旧命名：收藏文章实际上对应后端的 collection
    const addFavorite = (data: any, fetchOptions: any = {}) => {
        return useApi('/collection/collectionArticle', {
            method: 'POST',
            body: data,
            ...fetchOptions
        })
    }

    return {
        getArticleList,
        getArticleDetail,
        addFavorite
    }
}
