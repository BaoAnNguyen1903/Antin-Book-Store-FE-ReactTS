import axios from 'axios'

declare module 'axios' {
    export interface AxiosResponese<T = any> extends Promise<T> { }
}