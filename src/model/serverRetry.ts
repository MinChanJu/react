import axios from "axios";
import { useNavigate } from "react-router-dom";

// let url = "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/";
let url = "http://localhost:8080/api/";

export async function severComposeArrayRetry<T,D>(api: string, setData1: (data: T[]) => void, setData2: (data: D[]) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<{ problems: T[], contests: D[] }>(url + api, null, { timeout: 10000 });
            const data = response.data;
            setData1(data.problems);
            setData2(data.contests);
            console.log(`${api} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${api}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${api}.`);
                break;
            }
            console.log(`Retrying ${api} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function severArrayRetry<T>(api: string, setData: (data: T[]) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<T[]>(url + api, null, { timeout: 10000 });
            setData(response.data);
            console.log(`${api} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${api}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${api}.`);
                break;
            }
            console.log(`Retrying ${api} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function severObjectRetry<T>(api: string, setData: (data: T) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<T>(url + api, null, { timeout: 10000 });
            setData(response.data);
            console.log(`${api} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${api}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${api}.`);
                break;
            }
            console.log(`Retrying ${api} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function serverMessageWithObjectRetry<T,D>(api: string, send: D, setData: (data: T) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<T>(url + api, send, { timeout: 10000 });
            setData(response.data);
            console.log(`${api} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${api}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${api}.`);
                break;
            }
            console.log(`Retrying ${api} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function serverNoReturnRetry<T>(api: string, send: T, method: string, move: string, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;
    const navigate = useNavigate();

    while (attempts < maxRetries) {
        try {
            let response = ""
            if (method === "put") {response = await axios.put(url + api, send, { timeout: 10000 });}
            else if (method === "delete") {response = await axios.put(url + api, send, { timeout: 10000 });}
            else {console.log("잘못된 인수"); break}

            if (response !== "")
            console.log(`${api} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${api}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${api}.`);
                break;
            }
            console.log(`Retrying ${api} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}