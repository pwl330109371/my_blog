export const useArticleComments = () => {
    const addComment = (data: any) => {
        return useApi('/comment/createComment', {
            method: 'POST',
            body: data
        })
    }

    const getCommentList = (articleId: number | string) => {
        return useApi('/comment/getCommentList', {
            method: 'GET',
            params: { articleId }
        })
    }

    return {
        addComment,
        getCommentList
    }
}
