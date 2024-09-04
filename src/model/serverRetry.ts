import axios from "axios";

export async function severComposeArrayRetry<T,D>(url: string, setData1: (data: T[]) => void, setData2: (data: D[]) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<{ problems: T[], contests: D[] }>(url, null, { timeout: 10000 });
            const data = response.data;
            setData1(data.problems);
            setData2(data.contests);
            console.log(`${url.substring(69)} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${url.substring(69)}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${url.substring(69)}.`);
                break;
            }
            console.log(`Retrying ${url.substring(69)} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function severArrayRetry<T>(url: string, setData: (data: T[]) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<T[]>(url, null, { timeout: 10000 });
            setData(response.data);
            console.log(`${url.substring(69)} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${url.substring(69)}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${url.substring(69)}.`);
                break;
            }
            console.log(`Retrying ${url.substring(69)} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function severObjectRetry<T>(url: string, setData: (data: T) => void, maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.post<T>(url, null, { timeout: 10000 });
            setData(response.data);
            console.log(`${url.substring(69)} load complete`);
            break;  // 성공 시 루프 탈출
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for ${url.substring(69)}. Error: ${error.message}`);
            if (attempts >= maxRetries) {
                console.error(`All ${maxRetries} attempts failed for ${url.substring(69)}.`);
                break;
            }
            console.log(`Retrying ${url.substring(69)} in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}