export const SITE_OWNER_ID = 1

export const useSiteOwner = () => {
    const ownerInfo = useState<any | null>('site-owner-info', () => null)

    const fetchOwnerInfo = async (force = false) => {
        if (ownerInfo.value && !force) {
            return ownerInfo.value
        }

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
        ownerInfo.value = payload?.data || payload || null
        return ownerInfo.value
    }

    return {
        ownerInfo,
        fetchOwnerInfo
    }
}
