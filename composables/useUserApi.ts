export const getAboutMe = (userId: number | string) => {
    return useApi('/about/getAboutContent', {
        method: 'GET',
        params: { userId }
    })
}

export const updateUserInfo = (data: any) => {
    return useApi('/users/editUserInfo', {
        method: 'POST',
        body: data
    })
}
