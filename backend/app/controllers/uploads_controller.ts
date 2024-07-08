import Upload from '#models/upload'
import { uploadUpdateValidator, uploadValidator } from '#validators/upload'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'fs/promises'
import { STATUS_CODES } from 'http'

export default class UploadsController {
    public async store({ request, response, auth }: HttpContext) {

        const validatedData = await request.validateUsing(uploadValidator)

        const image = validatedData.image
        const imageName = `${new Date().getTime()}.${image.extname}`

        await image.move(app.makePath('uploads'), {
            name: imageName,
        })

        // Save the upload to the database
        const upload = await Upload.create({
            user_id: auth.user?.id,
            file_name: validatedData.file_name,
            image_path: imageName,
        })

        return response.json({
            message: 'Entry submitted successfully',
            data: upload,
        })
    }

    public async update({ request, response }: HttpContext) {

        const validatedData = await request.validateUsing(uploadUpdateValidator)
        try {
            const selectedUpload = await Upload.findOrFail(validatedData.id);

            if (validatedData.image) {
                const image = validatedData.image

                const imageName = `${new Date().getTime()}.${image.extname}`

                await image.move(app.makePath('uploads'), {
                    name: imageName,
                })

                selectedUpload.image_path = imageName;
            }

            selectedUpload.file_name = validatedData.file_name;
            selectedUpload.save()
        } catch (error) {
            return response.status(500).json({
                message: 'Some Error occured',
                errors: error.message
            })
        }
        return response.json({
            message: 'File updated successfully'
        })
    }

    public async deleteFile({ params, response }: HttpContext) {
        try {
            const upload = await Upload.findOrFail(params.id);
            await unlink('uploads/' + upload.image_path);
            await upload.delete();
        } catch (error) {
            return response.status(500).json({
                message: 'Some Error occured',
                errors: error.message
            })
        }
        return response.status(204).json({
            message: 'File deleted successfully',
        })

    }

    public async userFiles({ params, response }: HttpContext) {
        try {
            const user_id = params.id
            const uploads = await Upload.query()
                .where('user_id', user_id)
                .orderBy('created_at', 'desc')
                .select(['id', 'file_name', 'image_path'])

            return response.json({
                data: uploads,
            })
        } catch (error) {
            return response.status(500).json({
                message: 'Failed to fetch user files',
                error: error.message,
            })
        }
    }
}