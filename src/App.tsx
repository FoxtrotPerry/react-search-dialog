import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import './App.css';
import { Button, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Search } from '../react-search-dialog';

export type Client = {
    label: string;
    id: string;
    lastVisit: Date;
};

function App() {
    const [clients, setClients] = useState<Client[]>([]);
    const [clientNames, setClientNames] = useState<string[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client>();

    useEffect(() => {
        if (clients.length === 0) {
            const newClients: Client[] = [];
            for (let i = 0; i < 5000; i++) {
                newClients.push({
                    label: faker.person.fullName(),
                    id: faker.string.uuid(),
                    lastVisit: faker.date.past(),
                });
            }
            setClients(newClients);
            setClientNames(newClients.map((c) => c.label));
        }
    }, [clients]);

    const onItemSelect = (item: Client) => {
        setSelectedClient(item);
    };

    return (
        <div className="App">
            <Search
                items={clients}
                maxWidth={1000}
                quickFillItems={clients.slice(0, 10)}
                onItemSelect={onItemSelect}
                buttonProps={(smallDisplay) => {
                    return {
                        color: smallDisplay ? 'success' : 'error',
                    };
                }}
                renderResult={({ item, closeDialog, addToRecents }) => (
                    <ListItem dense>
                        <Stack
                            direction="row"
                            display="flex"
                            justifyContent="space-between"
                            sx={{ width: '100%' }}
                        >
                            <ListItemText sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>
                                    {`${item.label} - ${item.lastVisit.toDateString()}`}
                                </Typography>
                            </ListItemText>
                            <div>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Edit client');
                                        closeDialog();
                                    }}
                                    sx={{ marginRight: 1 }}
                                >
                                    <Typography>Edit Client</Typography>
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Go to records');
                                        addToRecents();
                                        closeDialog();
                                    }}
                                >
                                    <Typography>Go To Records</Typography>
                                </Button>
                            </div>
                        </Stack>
                    </ListItem>
                )}
            />
        </div>
    );
}

export default App;
