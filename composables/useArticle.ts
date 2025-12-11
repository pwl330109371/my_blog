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

    const addFavorite = (params: any) => {
        return useApi('/favorite/addFavorite', {
            method: 'POST',
            params
        })
    }

    return {
        getArticleList,
        getArticleDetail,
        addFavorite
    }
}
