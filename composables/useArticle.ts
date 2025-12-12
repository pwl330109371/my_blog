export const useArticle = () => {
    const getArticleList = (params: any) => {
        return useApi('/article/getArticleList', {
            method: 'GET',
            params
        })
    }

    const getArticleDetail = (params: any) => {
        return useApi('/article/getArticleDetail', {
            method: 'GET',
            params
        })
    }

    // 兼容旧命名：收藏文章实际上对应后端的 collection
    const addFavorite = (data: any) => {
        return useApi('/collection/collectionArticle', {
            method: 'POST',
            body: data
        })
    }

    return {
        getArticleList,
        getArticleDetail,
        addFavorite
    }
}
