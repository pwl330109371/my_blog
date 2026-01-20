export const useImg = () => {
    const getImgList = (params: any, fetchOptions: any = {}) => {
        return useApi('/img/getImgList', {
            method: 'GET',
            params,
            ...fetchOptions
        })
    }

    return {
        getImgList
    }
}
