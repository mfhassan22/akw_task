import vine from '@vinejs/vine'


export const uploadValidator = vine.compile(
    vine.object({
        image: vine.file({
            extnames: ['jpg', 'png', 'jpeg']
        }),
        file_name: vine.string(),
    })
)

export const uploadUpdateValidator = vine.compile(
    vine.object({
        image: vine.file({
            extnames: ['jpg', 'png', 'jpeg']
        }).optional(),
        file_name: vine.string(),
        id: vine.number()
    })
)