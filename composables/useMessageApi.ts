export const useMessageApi = () => {
    const getMessageIdentity = (nickname?: string) => {
        return useApi('/message/identity', {
            method: 'GET',
            params: nickname ? { nickname } : {}
        })
    }

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
        getMessageIdentity,
        addMessage,
        getMessageList
    }
}
