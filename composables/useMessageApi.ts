export const useMessageApi = () => {
    const addMessage = (data: any) => {
        return useApi('/message/add', {
            method: 'POST',
            body: data
        })
    }

    const getMessageList = () => {
        return useApi('/message/list', {
            method: 'GET'
        })
    }

    return {
        addMessage,
        getMessageList
    }
}
