export const getAboutMe = (userId: number | string) => {
    return useApi(`/user/about?userId=${userId}`)
}

export const updateUserInfo = (data: any) => {
    return useApi('/user/update', {
        method: 'POST',
        body: data
    })
}
