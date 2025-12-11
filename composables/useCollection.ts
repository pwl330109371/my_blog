export const useCollection = () => {
    const isCollection = (data: any) => {
        return useApi('/collection/isCollection', {
            method: 'POST',
            body: data
        })
    }

    const collectionArticle = (data: any) => {
        return useApi('/collection/collectionArticle', {
            method: 'POST',
            body: data
        })
    }

    const unCollectionArticle = (data: any) => {
        return useApi('/collection/unCollectionArticle', {
            method: 'POST',
            body: data
        })
    }

    const getCollectionList = (userId: string) => {
        return useApi('/collection/getCollectionList', {
            method: 'GET',
            params: { userId }
        })
    }

    return {
        isCollection,
        collectionArticle,
        unCollectionArticle,
        getCollectionList
    }
}
