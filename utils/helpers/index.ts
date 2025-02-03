export const getDocumentIconFromExtension = (path: string) => {
    const extension = path.split('.').pop()
    return extension == 'pdf' ? 'i-heroicons-document-text' : extension == 'mp4' ? 'i-heroicons-video-camera' : 'i-heroicons-photo'
}