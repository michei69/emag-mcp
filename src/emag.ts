// import { fetch } from "bun"
import type { Result } from "./emag-types"

export default class Emag {
    private token: string|null = null
    public tokenPromise = this.fetchToken()

    async fetchToken() {
        const req = await fetch("https://m-api.emag.ro/v2.0/user/details", { method: "HEAD" })
        this.token = req.headers.get("x-tokens")
    }
    private async _get<T, K>(url: string) {
        const req = await fetch(url, {
            headers: {
                "x-tokens": this.token!,
                "x-request-source": "mobile-app"
            }
        })
        const data = await req.json() as Result<T, K>
        return data.data
    }
    fetchSApi<T, K = any>(url: string) {
        return this._get<T, K>("https://sapi.emag.ro" + url)
    }
}
