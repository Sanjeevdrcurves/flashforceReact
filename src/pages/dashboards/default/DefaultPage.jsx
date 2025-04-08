import React, { useEffect } from 'react';
import { useLayout } from '@/providers';
import { Demo1LightSidebarPage, Demo2Page, Demo3Page, Demo4Page, Demo5Page } from '../';
import { fetchMenu } from '../../../config/menu.config'; // Import the fetchMenu function

const DefaultPage = () => {
    const { currentLayout } = useLayout();

    // Fetch the menu on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const menu = await fetchMenu(); // Await fetchMenu
                console.log('Fetched menu:', menu); // Handle the fetched menu if needed
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };
        fetchData();
    }, []); // Empty dependency array ensures it runs once on mount

    // Render the appropriate layout page based on currentLayout
    if (currentLayout?.name === 'demo1-layout') {
        return <Demo1LightSidebarPage />;
    } else if (currentLayout?.name === 'demo2-layout') {
        return <Demo2Page />;
    } else if (currentLayout?.name === 'demo3-layout') {
        return <Demo3Page />;
    } else if (currentLayout?.name === 'demo4-layout') {
        return <Demo4Page />;
    } else if (currentLayout?.name === 'demo5-layout') {
        return <Demo5Page />;
    } else if (currentLayout?.name === 'demo6-layout') {
        return <Demo4Page />;
    } else if (currentLayout?.name === 'demo7-layout') {
        return <Demo2Page />;
    } else if (currentLayout?.name === 'demo8-layout') {
        return <Demo4Page />;
    } else if (currentLayout?.name === 'demo9-layout') {
        return <Demo2Page />;
    } else if (currentLayout?.name === 'demo10-layout') {
        return <Demo3Page />;
    }

    return null; // Return null if no layout matches
};

export { DefaultPage };
