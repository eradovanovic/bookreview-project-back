import {JsonController, Get, Param, Post, Delete, Body, Put, Patch, UseBefore} from "routing-controllers";
import {Service} from "typedi";
import {UserRepository} from "./UserRepository";

@JsonController('/users')
@Service({global: true})
export class UserController {
    constructor(private userRepository: UserRepository) {
    }

    @Get('/')
    getAll() {
        return 'This action returns all users';
    }

    @Get('/:username')
    getOne(@Param('username') username: string) {
        return this.userRepository.loadUsersProfile(username)
    }

    @Post('/')
    post(@Body() user: any) {
        return this.userRepository.saveUser(user);
    }

    @Patch('/:username/update')
    updateUser(@Param('username') username: string, @Body() user: any) {
        return this.userRepository.updateUser({...user, username})
    }

    @Put('/:username/passwords')
    changePassword(@Param('username') username: string, @Body() user: any) {
        return this.userRepository.changePassword({...user, username})
    }

    @Delete('/:username')
    remove(@Param('username') username: string) {
        return this.userRepository.deleteUser(username)
    }

}
