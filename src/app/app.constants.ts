import { environment } from '../environments/environment';

export const apiPoint = environment.baseApi;

export const FBConfig = {
    appId: '1685300921784810',
    version: 'v3.2',
};
export const GoogleConfig = {
    clientId: '495257948392-b0mmklvtms77asrmkv5nqdgm84qu5h7e.apps.googleusercontent.com'
}
export const API = {
    fbAuth: apiPoint + '/auth/facebook',
    googleAuth: apiPoint + '/auth/google',
    login: apiPoint + '/auth/login',
    signIn: apiPoint + '/auth/signIn',
    search: apiPoint + '/search',
    history: apiPoint + '/search/history'
};
