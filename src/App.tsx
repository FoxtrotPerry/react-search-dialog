import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import './App.css';
import {
    AppBar,
    Button,
    ListItemButton,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { AllezSearch } from '@components';

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
            const newClients = [];
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
            <AppBar>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <AllezSearch
                        items={clients}
                        quickFillItems={clients.slice(0, 10)}
                        onItemSelect={onItemSelect}
                        renderResult={(item) => (
                            <ListItemButton
                                dense
                                onClick={() => {
                                    onItemSelect(item);
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
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ marginRight: 1 }}
                                        >
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
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default App;
