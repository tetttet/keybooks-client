"use client";
import { API_URL } from "@/constants/data";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ImageItem {
    url: string;
    description?: string;
}

interface ImagesContextType {
    images: ImageItem[];
    loading: boolean;
    fetchImages: () => Promise<void>;
    addImage: (url: string, description?: string) => Promise<void>;
    updateImage: (index: number, url: string, description?: string) => Promise<void>;
    deleteImage: (index: number) => Promise<void>;
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

interface ImagesProviderProps {
    userId: string;
    children: ReactNode;
}

export const ImagesProvider: React.FC<ImagesProviderProps> = ({ userId, children }) => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchImages = React.useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/images?userId=${userId}`);
            const data = await res.json();
            setImages(data.images || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const addImage = async (url: string, description?: string) => {
        try {
            const res = await fetch(`${API_URL}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, url, description })
            });
            const data = await res.json();
            setImages(data.images);
        } catch (err) {
            console.error(err);
        }
    };

    const updateImage = async (index: number, url: string, description?: string) => {
        try {
            const res = await fetch(`${API_URL}/images/${index}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, url, description })
            });
            const data = await res.json();
            setImages(data.images);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteImage = async (index: number) => {
        try {
            const res = await fetch(`${API_URL}/images/${index}?userId=${userId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            setImages(data.images);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [userId, fetchImages]);

    return (
        <ImagesContext.Provider value={{ images, loading, fetchImages, addImage, updateImage, deleteImage }}>
            {children}
        </ImagesContext.Provider>
    );
};

export const useImages = (): ImagesContextType => {
    const context = useContext(ImagesContext);
    if (!context) {
        throw new Error("useImages must be used within an ImagesProvider");
    }
    return context;
};
