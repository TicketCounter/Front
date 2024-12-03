import React from 'react';
import axios from '../../config/axios';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, TextField, Card, CardContent, CardActions, Typography, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import withAuth from '../../utils/withAuth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import 'react-toastify/dist/ReactToastify.css';
import { add, set } from 'lodash';
import { doc } from 'prettier';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [modalIsOpen4, setModalIsOpen4] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
    const [modalIsOpen3, setModalIsOpen3] = useState(false);
    const [currentEvent, setCurrentEvent] = useState('');

    const initialValues = {
        title: '',
        date: null,
        description: '',
    };

    const initialParticipant = {
        name: '',
        phone: ''
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, 'Title must be at least 3 characters')
            .max(50, 'Title must be less than 50 characters')
            .required('Title is required'),
        date: Yup.date()
            .min(new Date(), 'Date must be in the future')
            .required('Date is required'),
        description: Yup.string()
            .max(200, 'Description must be less than 200 characters')
            .required('Description is required'),
    });

    const validationSchema2 = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name must be less than 50 characters')
            .required('Name is required'),
        phone: Yup.string()
            .min(10, 'Phone number must be at least 10 characters')
            .required('Phone number is required'),
    });


    useEffect(() => {
        axios.get('/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the events!', error);
            });
    }, []);

    const handleSubmit = (values, { setSubmitting }) => {
        axios.post('/events/create', values)
            .then(response => {
                setEvents([...events, response.data]);
                setModalIsOpen(false);
                setNewEvent({ title: '', date: '', description: '' });
                toast.success('Event created successfully!');
            })
            .catch(error => {
                console.error('There was an error creating the event!', error);
                toast.error('There was an error creating the event!');
            });
        setSubmitting(false);
    };

    const handleDelete = (id) => {
        axios.delete(`/events/delete`, { data: { id } })
            .then(() => {
                setEvents(events.filter(event => event._id !== id));
                toast.success('Event deleted successfully!');
            })
            .catch(error => {
                console.error('There was an error deleting the event!', error);
                toast.error('There was an error deleting the event!');
            });
    };

    const truncateDescription = (description) => {
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    const showParticipants = (participants, id) => {
        setParticipants(participants);
        setCurrentEvent(id);
        setModalIsOpen2(true);
    };

    const handleEdit = (id) => {
        const event = events.find(event => event._id === id);
        setNewEvent({
            ...event,
            date: event.date ? new Date(event.date) : null // Ensure date is in Date object format
        });
        setModalIsOpen3(true);
    };

    const addParticipantModal = () => {
        setModalIsOpen2(false);
        setModalIsOpen4(true);
    }

    const addParticipant = (values, { setSubmitting }) => {
        axios.post('/events/addParticipant', {
            id: currentEvent,
            participant: {
                name: values.name,
                phone: values.phone,
            }
        })
        .then(response => {
            // Assuming the response contains the updated list of participants
            const updatedEvents = response.data;
            setEvents(updatedEvents);
            setModalIsOpen4(false);
            toast.success('Participant added successfully!');
        })
        .catch(error => {
            console.error('There was an error adding the participant!', error);
            toast.error('There was an error adding the participant!');
        });
        setSubmitting(false);
    };

    const handleDeleteParticipant = (participantId) => {
        axios.post('/events/removeParticipant', {
            id: currentEvent,
            participantId
        })
        .then(response => {
            const updatedEvents = response.data;
            setEvents(updatedEvents);
            setParticipants(participants.filter(participant => participant._id !== participantId));
            toast.success('Participant deleted successfully!');
        })
        .catch(error => {
            console.error('There was an error deleting the participant!', error);
            toast.error('There was an error deleting the participant!');
        });
    }



    return (
        <>
        <div style={{ padding: '16px' }}>
            <div style={{"display": "flex", "alignItems" : "center", "justifyContent": "space-between"}}>
                <Typography variant="h4" gutterBottom>Events</Typography>
                <Button variant="contained" color="primary" onClick={() => setModalIsOpen(true)}>Add Event</Button>
            </div>
            <Grid container spacing={3} style={{ marginTop: '16px' }}>
                {events.map(event => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card style={{ minHeight: '200px', maxHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardContent>
                                <Typography variant="h5">{event.title}</Typography>
                                <Typography color="textSecondary">{format(new Date(event.date), 'EEEE, do MMMM yyyy')}</Typography>
                                <Typography>{truncateDescription(event.description)}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" startIcon={<EditOutlined />} onClick={() => handleEdit(event._id)}>Edit</Button>
                                <Button size="small" style={{ color: 'red' }} startIcon={<DeleteOutlined />} onClick={() => handleDelete(event._id)}>Delete</Button>
                                <Button size="small" color="secondary" startIcon={<TeamOutlined />} onClick={() => showParticipants(event.participants, event._id)}>Participants ( {event.participants.length} )</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Add Event"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px',
                        maxWidth: '500px',
                        width: '100%'
                    }
                }}
            >
                <Typography variant="h5" gutterBottom>Add Event</Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue}) => (
                        <Form>
                            <Field
                                as={TextField}
                                label="Title"
                                name="title"
                                fullWidth
                                margin="normal"
                                helperText={<ErrorMessage name="title" />}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Field name="date">
                                    {({ field }) => (
                                        <DatePicker
                                            label="Date"
                                            value={field.value}
                                            onChange={(value) => setFieldValue('date', value)}
                                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                            <ErrorMessage name="date" component="div" style={{ color: 'red' }} />
                            <Field
                                as={TextField}
                                label="Description"
                                name="description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                helperText={<ErrorMessage name="description" />}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '16px' }}
                                disabled={isSubmitting}
                            >
                                Add Event
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <Modal
                isOpen={modalIsOpen3}
                onRequestClose={() => setModalIsOpen3(false)}
                contentLabel="Edit Event"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px',
                        maxWidth: '500px',
                        width: '100%'
                    }
                }}
            >
                <Typography variant="h5" gutterBottom>Edit Event</Typography>
                <Formik
                    enableReinitialize
                    initialValues={newEvent}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const eventId = newEvent._id;
                        axios.put(`/events/update`, { eventId , values } )
                            .then(response => {
                                setEvents(events.map(event => event._id === newEvent._id ? response.data : event));
                                setModalIsOpen3(false);
                                setNewEvent({ title: '', date: '', description: '' });
                                toast.success('Event updated successfully!');
                            })
                            .catch(error => {
                                console.error('There was an error updating the event!', error);
                                toast.error('There was an error updating the event!');
                            });
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Field
                                as={TextField}
                                label="Title"
                                name="title"
                                fullWidth
                                margin="normal"
                                helperText={<ErrorMessage name="title" />}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Field name="date">
                                    {({ field }) => (
                                        <DatePicker
                                            label="Date"
                                            value={field.value}
                                            onChange={(value) => setFieldValue('date', value)}
                                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                        />
                                    )}
                                </Field>
                            </LocalizationProvider>
                            <ErrorMessage name="date" component="div" style={{ color: 'red' }} />
                            <Field
                                as={TextField}
                                label="Description"
                                name="description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                helperText={<ErrorMessage name="description" />}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '16px' }}
                                disabled={isSubmitting}
                            >
                                Update Event
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <Modal
                isOpen={modalIsOpen2}
                onRequestClose={() => setModalIsOpen2(false)}
                contentLabel="Participants"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        
                    }
                }}
            >
                
                <div style={{"display":"flex", "alignItems" : "center", "justifyContent" : "space-between", "padding": "10px"}}>
                    <Typography variant="h5" gutterBottom>Participants</Typography>
                    <div style={{"display":"flex", "alignItems": "center", "gap": "10px"}}>
                        <Button variant="contained" color="primary" onClick={() => addParticipantModal()} >Add Participant</Button>
                        <Button variant="contained" color="primary" onClick={downloadTableOfParticipantsAsPDF}>Download PDF</Button>
                    </div>
                </div>
                <TableContainer component={Paper} sx={{maxHeight: '600px', overflowY: 'scroll'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {participants.map(participant => (
                                <TableRow key={participant._id}>
                                    <TableCell>{participant.name}</TableCell>
                                    <TableCell>{participant.phone}</TableCell>
                                    <TableCell>{participant.date}</TableCell>
                                    <TableCell>
                                        <Button size="small" style={{ color: 'red' }} startIcon={<DeleteOutlined />} onClick={() => handleDeleteParticipant(participant._id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>

            <Modal
                isOpen={modalIsOpen4}
                onRequestClose={() => setModalIsOpen4(false)}
                contentLabel="Add Participant"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px',
                        maxWidth: '500px',
                        width: '100%'
                    }
                }}
            >
                <Typography variant="h5" gutterBottom >Add Participant</Typography>
                <Formik
                    initialValues={initialParticipant}
                    validationSchema={validationSchema2}
                    onSubmit={addParticipant}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Field
                                as={TextField}
                                label="Name"
                                name="name"
                                fullWidth
                                margin="normal"
                                id="-name"
                                helperText={<ErrorMessage name="name" />}
                            />
                            <Field
                                as={TextField}
                                label="Phone"
                                name="phone"
                                fullWidth
                                margin="normal"
                                id="-phone"
                                helperText={<ErrorMessage name="phone" />}
                            />
                            <ErrorMessage name="date" component="div" style={{ color: 'red' }} />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '16px' }}
                                disabled={isSubmitting}
                            >
                                Add Participant
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <ToastContainer />
        </div>
        </>
    );
};

export default withAuth(Events);