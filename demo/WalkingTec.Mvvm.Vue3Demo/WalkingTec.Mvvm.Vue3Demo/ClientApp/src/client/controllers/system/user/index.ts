/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2021-04-02 11:49:08
 * @modify date 2021-04-02 11:49:08
 * @desc 用户管理
 */
import { globalProperties } from "@/client";
import lodash from 'lodash';
import { BindAll } from 'lodash-decorators';
import { UserEntity } from './entity';
import { UserMenus } from './menus';
@BindAll()
export class UserController extends UserEntity {
    $ajax = globalProperties.$Ajax;
    UserMenus = new UserMenus()
    async onInit() {
        await this.onPersist()
        this.onCheckLogin()
    }
    onSetUserInfo(info) {
        this.UserInfo = info;
        this.UserMenus.onInit(this.UserInfo.Attributes.Menus)
    }
    /**
     * 登录
     */
    async onSignIn(body: { account: string, password: string }) {
        this.onToggleLoading(true)
        const res = await this.$ajax.post<any>('/api/_Account/Login', { rememberLogin: false, ...body }, { 'Content-Type': null })
        this.onSetUserInfo(res)
    }
    /**
     * 校验登录状态
     */
    async onCheckLogin() {
        this.onToggleLoading(true)
        try {
            const userid = lodash.get(this.UserInfo, 'ITCode');
            if (userid) {
                const res = await this.$ajax.get("/api/_Account/CheckUserInfo");
                this.onSetUserInfo(res)
            }
            this.onToggleLoading(false)
        } catch (error) {
            this.onToggleLoading(false)
            this.onLogOut()
            throw error
        }
    }
    async onLogOut() {
        this.$ajax.get("/api/_Account/Logout");
        this.onSetUserInfo({})
    }
}
// export const UserStore = new UserController()