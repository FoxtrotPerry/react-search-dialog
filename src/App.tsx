import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import './App.css';
import { Button, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { AllezSearch } from '../allez';

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
                    label: faker.name.fullName(),
                    id: faker.datatype.uuid(),
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
            <AllezSearch
                items={clients}
                maxWidth={1000}
                quickFillItems={clients.slice(0, 10)}
                onItemSelect={onItemSelect}
                renderResult={(item, onItemSelectCallback) => (
                    <ListItemButton
                        dense
                        onClick={() => {
                            onItemSelectCallback();
                        }}
                    >
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
                                <Button variant="contained" size="small" sx={{ marginRight: 1 }}>
                                    <Typography>Dummy button</Typography>
                                </Button>
                                <Button variant="outlined" size="small">
                                    <Typography>Super Smart button</Typography>
                                </Button>
                            </div>
                        </Stack>
                    </ListItemButton>
                )}
            />
        </div>
    );
}

export default App;
