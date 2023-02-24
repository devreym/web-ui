import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import f from '../../functions'
import { Card, Icon, Image, Button, Grid, Segment, Divider, Header, GridRow, Label } from 'semantic-ui-react'
import moment, { duration } from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import TextField from '@mui/material/TextField';


export default ({
}) =>  {
    const [events, setEvents] = useState([]);
    const [session, setSession] = useState('');
    const [sPackage, setSPackage] = useState('');
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState('');
    const [shootDuration, setShootDuration] = useState(1);
    const [freeSlots, setFreeSlots] = useState([])

    const didMount = useRef(false);
    useEffect(() => {
    }, []);


    useEffect(() => {
        getFreeSlots() 
      
    }, [events][date]);

    const getEvents = (d) => {
        f.fetch({
            api: '/api/calendar/event/get',
            payload: { date: d.format('YYYY-MM-DD')},
            success: p => {
                if(p.success) {
                    setEvents(p.result)
                    getFreeSlots() 
                } else {
                    
                }
            }
        });
    
    }

    const createFreeSlots = async () => {
        // parse start and end times as Moment objects without a date
        const startOfDay = moment('08:00', 'HH:mm');
        const endOfDay = moment('23:59', 'HH:mm');

        // define desired duration of each timeslot in minutes
        const durationMinutes =  shootDuration * 60;

        // initialize empty array for available timeslots
        const availableTimeslots = [];

        // loop through each timeslot and add to array if available
        for (let time = startOfDay; time.isBefore(endOfDay); time.add(durationMinutes, 'minutes')) {
            const timeslotStart = time.format('HH:mm');
            const timeslotEnd = time.add(durationMinutes, 'minutes').format('HH:mm');
            availableTimeslots.push({
                start: timeslotStart,
                end: timeslotEnd
            });
        }

        console.log(availableTimeslots)

        setFreeSlots(availableTimeslots)
    }

    const getFreeSlots = async () => {
        // Example array of time schedules
        // Example array of time schedules
        var done = false;
        var appointments = []
       
        events.map((e, i) => {
            console.log(e.start.dateTime)
            appointments.push({start: moment(e.start.dateTime).format('HH:mm'), end: moment(e.end.dateTime).format('HH:mm')})
            done = true;
        })
        
        if(done) {
            // Duration in minutes
            const duration = shootDuration * 60;

            // Start and end times of the day
            const startOfDay = moment('08:00', 'HH:mm');
            const endOfDay = moment('23:59', 'HH:mm');

            // Create an array of time slots for the day
            const timeSlots = [];
            let currentTime = moment(startOfDay);
            while (currentTime.isBefore(endOfDay)) {
                const nextTime = moment(currentTime).add(duration, 'minutes');
                timeSlots.push({
                    start: currentTime.format('HH:mm'),
                    end: nextTime.format('HH:mm')
                });
                currentTime = nextTime;
            }

            // Find occupied time slots
            const occupiedTimeSlots = [];
            for (let i = 0; i < appointments.length; i++) {
                const appointment = appointments[i];
                const startTime = moment(appointment.start, 'HH:mm');
                const endTime = moment(appointment.end, 'HH:mm');
                for (let j = 0; j < timeSlots.length; j++) {
                    const timeSlot = timeSlots[j];
                    const timeSlotStart = moment(timeSlot.start, 'HH:mm');
                    const timeSlotEnd = moment(timeSlot.end, 'HH:mm');
                    if (startTime.isSameOrBefore(timeSlotStart) && endTime.isSameOrAfter(timeSlotEnd)) {
                        occupiedTimeSlots.push(timeSlot);
                    } else if (startTime.isSameOrAfter(timeSlotStart) && endTime.isSameOrBefore(timeSlotEnd)) {
                        occupiedTimeSlots.push(timeSlot);
                    } else if (startTime.isBefore(timeSlotEnd) && endTime.isAfter(timeSlotStart)) {
                        occupiedTimeSlots.push(timeSlot);
                    }
                }
            }

            // Remove occupied time slots from timeSlots array
            const freeTimeSlots = timeSlots.filter(timeSlot => {
                return !occupiedTimeSlots.some(occupiedSlot => {
                    return timeSlot.start === occupiedSlot.start && timeSlot.end === occupiedSlot.end;
                });
            });

            // Filter free time slots by duration
            const freeSlots = freeTimeSlots.filter(timeSlot => {
                const slotDuration = moment.duration(moment(timeSlot.end, 'HH:mm').diff(moment(timeSlot.start, 'HH:mm'))).asMinutes();
                return slotDuration >= duration;
            });

            setFreeSlots(freeSlots);
        }
    }
    

    function addPadding(integer, length){
        var integerString = integer + '';
          while (integerString.length < length) {
            integerString = '0' + integerString;
          }
        return integerString;
    }

    const hoursArray = Array.from({ length: Math.floor(16 / shootDuration ) + 1 }, (_, i) => {
        // Add a leading zero to single-digit numbers
        const hour = (i * (shootDuration+1) + 8).toString().padStart(2, '0');
        return hour
    });
      

    return (
        <div id="container" style={{padding: 20}}>
            {/* <Card>
                <Image src='https://d37b3blifa5mva.cloudfront.net/000_clients/3328781/page/w400-10751257376-img-5689-99ca0e.jpg' wrapped ui={false} />
                <Card.Content>
                <Card.Header>Matthew</Card.Header>
                <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                    Matthew is a musician living in Nashville.
                </Card.Description>
                </Card.Content>
            </Card> */}
            <div ></div>
      

            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Header size='medium'>Session</Header>
                            <Button.Group fluid>
                                    <Button onClick={(e)=> setSession(e.target.innerText) }>Prenup Shoot</Button>
                                    <Button onClick={(e)=> setSession(e.target.innerText) }>Baby Shoot</Button>
                                    <Button onClick={(e)=> setSession(e.target.innerText) }>Potrait Shoot</Button>
                                    <Button onClick={(e)=> setSession(e.target.innerText) }>Maternity Shoot</Button>
                                    <Button onClick={(e)=> setSession(e.target.innerText) }>Others</Button>
                            </Button.Group>
                            <Divider section />

                            <Header size='medium'>Package</Header>
                            <Card.Group fluid itemsPerRow={2}>
                                <Card onClick={()=> { setSPackage('A'); setShootDuration(2) }}>
                                    <Card.Content>
                                        <Card.Header>PACKAGE A</Card.Header>
                                        <Card.Meta>1-2 hrs shoot</Card.Meta>
                                        <Card.Description>          
                                            <ul>
                                                <li>1 photographer</li>
                                                <li>2 backdrop options</li>
                                                <li>Bring your own props</li>
                                                <li>Free use of the studio </li>
                                            </ul>  
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <p style={{ color: '#8B572A', fontWeight: 'bold', fontSize: 20}}> ₱ 3,000 </p>
                                    </Card.Content>
                                </Card>
                                <Card onClick={()=> { setSPackage('B');  setShootDuration(3)  }}>
                                    <Card.Content>
                                        <Card.Header>PACKAGE B</Card.Header>
                                        <Card.Meta> 2-3 hrs shoot</Card.Meta>
                                        <Card.Description>          
                                            <ul>
                                                <li> 1 photographer</li>
                                                <li> 1 stylist</li>
                                                <li> 3 backdrop options</li>
                                                <li> Bring your own props</li>
                                                <li> Free creative direction and use of the studio </li>
                                            </ul>  
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <p style={{ color: '#8B572A', fontWeight: 'bold', fontSize: 20}}> ₱ 7,000 </p>
                                    </Card.Content>
                                </Card>
                                <Card onClick={()=> { setSPackage('C');  setShootDuration(4)  }}>
                                    <Card.Content>
                                        <Card.Header>PACKAGE C</Card.Header>
                                        <Card.Meta> 3-4 hrs shoot</Card.Meta>
                                        <Card.Description>          
                                            <ul>
                                                <li>1 photographer</li>
                                                <li>1 videographer</li>
                                                <li>1 stylist</li>
                                                <li>1 HMUA</li>
                                                <li>1 production assistant</li>
                                                <li>30-60 seconder video</li>
                                                <li>4 backdrop options</li>
                                                <li>Bring your own props</li>
                                                <li>Free creative direction and use of the studio</li>
                                            </ul>  
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <p style={{ color: '#8B572A', fontWeight: 'bold', fontSize: 20}}> ₱ 15,000 </p>
                                    </Card.Content>
                                </Card>
                                <Card color={sPackage == 'D' ? 'red' : 'grey'} onClick={()=> { setSPackage('D');  setShootDuration(6) }}>
                                    <Card.Content >
                                        <Card.Header>PACKAGE D</Card.Header>
                                        <Card.Meta> 5-6 hrs shoot</Card.Meta>
                                        <Card.Description>          
                                            <ul>
                                                <li>1 photographer</li>
                                                <li>1 videographer</li>
                                                <li>1 stylist</li>
                                                <li>1 HMUA</li>
                                                <li>1 production assistant</li>
                                                <li>60-90 seconder video</li>
                                                <li>15 seconder teaser video</li>
                                                <li>Free all backdrop options</li>
                                                <li>1 Themed Layout</li>
                                                <li>Free creative direction and use of the studio</li>
                                            </ul>  
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <p style={{ color: '#8B572A', fontWeight: 'bold', fontSize: 20}}> ₱ 20,000 </p>
                                    </Card.Content>
                                </Card>
                            </Card.Group>
                            <Divider section />
                            <Grid columns={2} divided>
                                <Grid.Column>
                                    <Header size='medium'>Schedule</Header>
                                    {/* <Label as='a' color='red' ribbon>Overview</Label> */}
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <StaticDatePicker
                                            displayStaticWrapperAs="desktop"
                                            openTo="day"
                                            value={date ? date : moment()}
                                            minDate={moment().add(1, 'days')}
                                            onChange={(newValue) => {
                                                setDate(newValue);
                                                getEvents(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid.Column>
                                <Grid.Column>
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                    {   
                                      
                                        (date !== '') ? 
                                            freeSlots.map((e, i) =>{
                                            return <Button key={'button-time-'+ i} inverted color='brown' style={{marginBottom: 5}}>{ moment(e.start, 'HH:mm').format('h:mm A')} - {moment(e.end, 'HH:mm').format('h:mm A')}</Button>
                                            })
                                        : <p></p>
                                    }
                                    </div>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Summary</h2>
                        <p>Session: {session}</p>
                        <p>Package: {sPackage}</p>
                        <p>Date: {date && date.format('YYYY-MM-DD')}</p>
                        {/* {   events.length > 0 ?
                                events.map((e, i) => {
                                return  <p key={'events-' + i}>{e.id}</p> })
                            : <></>
                        } */}
                    </Grid.Column>
                </Grid.Row>     
            </Grid>
           
     
        </div>
    )
}