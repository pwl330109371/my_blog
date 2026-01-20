export const useArticleComments = () => {
    const addComment = (data: any, fetchOptions: any = {}) => {
        return useApi('/comment/createComment', {
            method: 'POST',
            body: data,
            ...fetchOptions
        })
    }

    const getCommentList = (articleId: number | string, fetchOptions: any = {}) => {
        return useApi('/comment/getCommentList', {
            method: 'GET',
            params: { articleId },
            ...fetchOptions
        })
    }

    return {
        addComment,
        getCommentList
    }
}
