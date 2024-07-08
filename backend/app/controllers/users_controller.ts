import type { HttpContext } from '@adonisjs/core/http'

import User from "#models/user";

export default class UsersController {
    public async getAllUsers({ response }: HttpContext) {
        try {
            const users = await User.all();
            return response.json({
                data: users
            })
        }
        catch (error) {
            return response.status(500).json({
                message: 'Failed to fetch users',
                error: error.message,
            })
        }
    }

    public async changeUserRole({ params, response }: HttpContext) {
        try {
            const user = await User.findOrFail(params.id);
            if (user.role_id == 1) {
                user.role_id = 2;
            }
            else if (user.role_id == 2) {
                user.role_id = 1;
            }
            await user.save();
            return response.status(204);
        } catch (error) {
            return response.status(500).json({
                message: 'Error occure during role change',
                error: error.message
            });
        }
    }
}