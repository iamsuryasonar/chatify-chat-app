import { useState } from "react"

export function useError() {
    const [error, setError] = useState(false);

    return { error, setError };
}