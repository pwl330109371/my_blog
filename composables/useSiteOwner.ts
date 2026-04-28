export const SITE_OWNER_ID = 1
const DEFAULT_OWNER_INFO = {
    id: SITE_OWNER_ID,
    nickName: '从前慢',
    picture: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210415142326.jpg',
    gender: 1
}

export const useSiteOwner = () => {
    const ownerInfo = useState<any>('site-owner-info', () => ({ ...DEFAULT_OWNER_INFO }))

    const fetchOwnerInfo = async (force = false) => {
        if (ownerInfo.value && !force) {
            return ownerInfo.value
        }

        try {
            const { data, error } = await useApi('/users/getUserInfo', {
                method: 'GET',
                params: {
                    userId: SITE_OWNER_ID
                }
            })

            if (error.value) {
                throw error.value
            }

            const payload = data.value as any
            ownerInfo.value = payload?.data || payload || { ...DEFAULT_OWNER_INFO }
        } catch (error) {
            console.warn('Fetch owner info failed, fallback to default owner info:', error)
            ownerInfo.value = ownerInfo.value || { ...DEFAULT_OWNER_INFO }
        }

        return ownerInfo.value
    }

    return {
        ownerInfo,
        fetchOwnerInfo
    }
}
