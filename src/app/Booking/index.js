
import React, { useState, useEffect, useRef } from 'react';
import f from '../../functions/index'
import './index.css';
import sessions from '../../references/session';
import studioPackages  from '../../references/packages';
import shootPackages from '../../references/self-shoot-package';
import shootExtras from '../../references/self-shoot-extras';
import selfShootGuidelines from '../../references/self-shoot-guidelines';
import packagesGuidelines from '../../references/packages-guidelines';
import { Card, Icon, Image, Button, Grid, List,Table, Message, Segment, Dimmer, Item, Input, Select, TextArea, Form, Loader, Divider, Header, GridRow, Label, Step, Placeholder } from 'semantic-ui-react'
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import TextField from '@mui/material/TextField';

export default ({}) => {
const [submitLoading, setSubmitLoading] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [shootSession, setShootSession] = useState(1);
const [shootPackage, setShootPackage] = useState('');
const [date, setDate] = useState('');
const [timeSlotLoading, setTimeSlotLoading] = useState(false)
const [freeSlots, setFreeSlots] = useState([])
const [selectedTimeSlot, setSelectedTimeSlot] = useState({})

const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [notes, setNotes] = useState('');
const [submitResult, setSubmitResult] = useState(null);

const StepSession = ({ }) => {
    return <><div className='ui six cards'>
        {
            sessions.map((session, i) => {
                return <a className='ui card' key={'ui-card-session-' + i}
                    onClick={()=> {
                        setShootSession(session);
                        setCurrentStep(2)
                    }}>
                    <div className='image'><img src={session.image}/></div>
                    <div className="content">
                        <div className='header'>{session.session}</div>
                        <div className='description'>{session.description}</div>
                    </div>
                </a>
            })
        }
    </div>
    <p style={{marginTop: 50, color: '#bfbfbd'}}><i>The client selects what type of shoot he/she needs</i></p>
    </>
};

const StepPackage = ({}) => {
    return (shootSession.id == 'self-shoot') ?
    <><div className='ui five cards'>
        {
            shootPackages.map((sp, i) => {
                return <a className='ui card' key={'ui-card-package-' + i}
                    onClick={()=> {
                        setShootPackage(sp);
                        setCurrentStep(3)
                    }}>
                    <div className='image'><img src={sp.image}/></div>
                    <div className="content">
                        <div className='header'>{sp.package}</div>
                        <div className='meta'>{sp.session}</div>
                        <div className='description'>{sp.description}</div>
                    </div>
                    <div className='extra content'>
                        {extra(sp.price)}
                    </div>
                </a>
            })
        }
        <div className='ui card'>
            <div className='content'>
                <div className='description'>
                    <a className='ui brown ribbon label'>GUIDELINES</a>
                    <div className='ui segment basic'>
                        <div role="list" className="ui bulleted list">
                            {
                                selfShootGuidelines.map((g, i) => {
                                    return <div role="listitem" key={'list-selft-shoot-guidelines-' + i} className="item">{g}</div>

                                })
                            }
                        </div>
                    </div>
                    <a className="ui brown ribbon label">EXTRAS</a>
                    <div className='ui segment basic'>
                        <div role="list" className="ui divided middle aligned list">
                            {
                                 shootExtras.extras.map((e, i) => {
                                    return <div role="listitem" key={'list-package-extras-' + i} className="item">
                                        <div class="right floated content">
                                            <span>{e.price}</span>
                                        </div>
                                        <div class="content">{e.additional}</div>
                                    </div>
                                })
                            }
                        </div>
                        <span style={{fontSize: 10}}><i>*Raw will be sent through Google Drive within a day; expires in a week after your shoot</i></span>
                    </div>
                    <a className="ui brown ribbon label">ADDITIONALS</a>
                    <div className='ui segment basic'>
                        <div role="list" className="ui divided middle aligned list">
                            {
                                 shootExtras.additionals.map((e, i) => {
                                    return <div role="listitem" key={'list-package-additionals-' + i} className="item">
                                        <div class="right floated content">
                                            <span>{e.price}</span>
                                        </div>
                                        <div class="content">{e.additional}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p style={{marginTop: 50, color: '#bfbfbd'}}><i>The packages shown will depend on what shoot the client selected </i></p>
    </>
    :
    <><div className='ui five cards'>
        {
            studioPackages.map((sp, i) => {
                return <a className='ui card' key={'ui-card-package-' + i}
                    onClick={()=> {
                        setShootPackage(sp);
                        setCurrentStep(3)
                    }}>
                    <div className='image'><img src={sp.image}/></div>
                    <div className="content">
                        <div className='header'>{sp.package}</div>
                        <div className='meta'>{sp.subtitle}</div>
                        <div className='description'>{packages(sp.items)}</div>
                    </div>
                    <div className='extra content'>
                        {extra(sp.price)}
                    </div>
                </a>
            })
        }
        <div className='ui card'>
            <div className='content'>
                <div className='description'>
                    <a className='ui brown ribbon label'>GUIDELINES</a>
                    <div className='ui segment basic'>
                        <div role="list" className="ui bulleted list">
                            {
                                packagesGuidelines.map((g, i) => {
                                    return <div role="listitem" key={'list-studio-package-guidelines-' + i} className="item">{g}</div>

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p style={{marginTop: 50, color: '#bfbfbd'}}><i>The packages shown will depend on shoot what the client selected </i></p>
    </>
}

const StepSchedule = ({}) => (
  <>
  <Grid columns={2} divided>
        <Grid.Column>
            <Segment basic>  
                <LocalizationProvider dateAdapter={AdapterMoment}>
                {/* <Segment basic><Header size='small'>Select a date</Header> </Segment> */}
                    <StaticDatePicker
                        label="Date"
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        value={date ? date : moment()}
                        minDate={moment().add(1, 'days')}
                        onChange={(newValue) => {
                            setDate(newValue);
                            getEvents(newValue);
                            setFreeSlots([]);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Segment>
        </Grid.Column>
        <Grid.Column>
            <Loader active={timeSlotLoading} inline='centered' />
                {(freeSlots.length>0) ? <>
                    <Header size='small' style={{margin: 16}}>Select your time slot</Header> 
                </>
                :
                <></>}
            <div style={{ display: 'flex', flexDirection: 'column', margin: 16}}>
                {   
                    
                    freeSlots.map((e, i) =>{
                        return <Button key={'button-freeslots-item-' +i}
                            inverted 
                            onClick={()=>{
                                setSelectedTimeSlot({
                                    start: {
                                        rawFormat: e.start,
                                        dateTime: moment(date).format('YYYY-MM-DD') + 'T' + e.start + ':00',
                                        timeZone: "Asia/Manila"
                                    }, 
                                    end: {
                                        rawFormat: e.end,
                                        dateTime: moment(date).format('YYYY-MM-DD') + 'T' + e.end + ':00',
                                        timeZone: "Asia/Manila"
                                    }
                                })
                                setCurrentStep(4)
                            }} 
                            color='brown' 
                            style={{marginBottom: 5}}>
                            { moment(e.start, 'HH:mm').format('h:mm A')} - {moment(e.end, 'HH:mm').format('h:mm A')}
                        </Button>
                    })
                
                }
            </div>
        </Grid.Column>
    </Grid>
    <p style={{marginTop: 50, color: '#bfbfbd'}}><i>The client then select the date and time for the shoot. The system will automatically find available time slots in the calendar depending on the duration or hours needed for the shoot she/he selected.</i></p>
    </>
)

const extra = (e) => {
    return <p style={{ color: '#8B572A', fontWeight: 'bold', fontSize: 20}}> {e} </p>
}

const packages = (p) => {
    return  <Segment basic><List bulleted>{
        p.map((e, i) => <List.Item key={'list-item-packages-'+e+i} style={{color: 'black'}}>{e}</List.Item>)
    }</List></Segment>
}


const getEvents = (d) => {
    setTimeSlotLoading(true);
    f.fetch({
        api: '/ui/api/calendar/event/get',
        payload: { date: d.format('YYYY-MM-DD')},
        success: p => {
            if(p.success) {
                if(p.result.length> 0) {
                    getFreeSlots(p.result);
                } else {
                    getFreeSlots([])
                }
               
            } else {
                console.log('Something Went Wrong '+ p)
            }
        }
    });
}

const resetSchedule = () => {
    setFreeSlots([]);
    setDate(moment());
    setSubmitResult(null);

}

const getFreeSlots = async (events) => {
    // Example array of time schedules
    // Example array of time schedules

    var done = false;
    var appointments = []

    if(events.length > 0) {
        events.map((e, i) => {
            console.log(e.start.dateTime)
            appointments.push({start: moment(e.start.dateTime).format('HH:mm'), end: moment(e.end.dateTime).format('HH:mm')})
            done = true;
        })
    } else {
        done=true;
    }
    
    if(done) {
        // Duration in minutes
        const duration = shootPackage.duration;

        // Start and end times of the day
        const startOfDay = moment('09:00', 'HH:mm');
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
        setTimeSlotLoading(false);
    }
}

const submitBooking = (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    let payload =  {
        summary: shootSession.session + ' for ' + firstName + ' ' + lastName,
        location: 'Studio Sai Zacarias',
        description: shootPackage.package + ' - Notes: ' + notes,
        start: selectedTimeSlot.start,
        end: selectedTimeSlot.end,
        attendees: [
            { email: email}
        ],
        reminders: {
          useDefault: true
        }
    }

    f.fetch({
        api: '/ui/api/calendar/event/create',
        payload: payload,
        success: p => {
            if(p.success) {
                setSubmitLoading(false);
               setSubmitResult(
                {
                    message: 'Congratulations!!',
                    success: true,
                    result: p.result
                }
            )
               
            } else {
                setSubmitLoading(false);
                setSubmitResult({
                    success: false,
                    message: 'Something went wrong'
                })
                console.log('Something Went Wrong '+ p)
                
            }
        }
    });
    
}

return (
    <div id='booking-container'>
    <div className='step-container'>
        <Step.Group attached='top' widths={4} style={{ textAlign: 'left' }}>
            <Step  active={currentStep == 1 ? true : false } onClick={()=> {setCurrentStep(1); resetSchedule()}} >
            <Icon name='camera'/>
            <Step.Content >
                <Step.Title style={{color: (currentStep !== 1) ? 'green' : ''}}>Session  {(currentStep !== 1)?<Icon name='check' color='green' /> :<></>}</Step.Title>
                {
                    (currentStep !== 1) ? <Step.Description>{shootSession.session}</Step.Description> : <Step.Description>Choose your shoot</Step.Description> 
                }
            </Step.Content>
            </Step>
            <Step active={currentStep == 2 ? true : false } disabled={currentStep == 1 ? true : false } onClick={()=> {setCurrentStep(2); resetSchedule()}}>
            <Icon name='clipboard list' />
            <Step.Content>
                <Step.Title style={{color: (currentStep !== 2 && currentStep !== 1 ) ? 'green' : ''}}>Package  {(currentStep !== 2 && currentStep !== 1 ) ?<Icon name='check' color='green' /> :<></>}</Step.Title> 
                {
                    (currentStep !== 2 && currentStep !== 1 ) ?
                    <Step.Description>{shootPackage.package + ' - ' + shootPackage.subtitle} </Step.Description> 
                    : <Step.Description>Choose your package</Step.Description> 
                }
            </Step.Content>
            </Step>
            <Step active={currentStep == 3 ? true : false } disabled={currentStep == 2  || currentStep == 1 ? true : false } onClick={()=> {setCurrentStep(3)}}>
            <Icon name='calendar alternate' />
            <Step.Content>
            <Step.Title style={{color: (currentStep !== 2 && currentStep !== 1  && currentStep !== 3) ? 'green' : ''}}>Schedule  {(currentStep !== 2 && currentStep !== 1  && currentStep !== 3) ?<Icon name='check' color='green' /> :<></>}</Step.Title> 
                {
                    (currentStep !== 2 && currentStep !== 1 && currentStep !== 3) ?
                    <Step.Description>{moment(date).format('MMMM DD YYYY') + ' ' + moment(selectedTimeSlot.start.rawFormat, 'HH:mm').format('h:mm A')} - {moment(selectedTimeSlot.end.rawFormat, 'HH:mm').format('h:mm A')}</Step.Description> 
                    : <Step.Description>Select your schedule</Step.Description> 
                }
                
            </Step.Content>
            </Step>
            <Step active={currentStep == 4 ? true : false } disabled={currentStep == 2  || currentStep == 1 || currentStep == 3 ? true : false} >
            <Icon name='info' />
            <Step.Content>
                <Step.Title>Summary & Details</Step.Title>
                <Step.Description></Step.Description> 
            </Step.Content>
            </Step>
        </Step.Group>


    </div>  
        <Segment basic>
            {currentStep === 1 && <StepSession />}
            {currentStep === 2 && <StepPackage />}
            {currentStep === 3 && <StepSchedule />}
            {/* {currentStep === 4 && <StepForm />} */}
            {currentStep === 4 && 
            <><div style={{display: 'flex', flexDirection: 'row' }}>
                <div style={{flexGrow: 1}}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Description>
                            <Divider horizontal>
                                <Header as='h4'>
                                    {/* <Icon name='bar chart' /> */}
                                    SUMMARY
                                </Header>
                            </Divider>
                            
                            <Table definition>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width={5}>Date & Time</Table.Cell>
                                        <Table.Cell>{moment(date).format('MMMM DD YYYY') + ' ' + moment(selectedTimeSlot.start.rawFormat, 'HH:mm').format('h:mm A')} - {moment(selectedTimeSlot.end.rawFormat, 'HH:mm').format('h:mm A')}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Duration</Table.Cell>
                                        <Table.Cell>{shootPackage.duration + ' minutes'}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell width={2}>Session</Table.Cell>
                                        <Table.Cell>{shootSession.session}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Package</Table.Cell>
                                        <Table.Cell>{shootPackage.package + ' - ' + shootPackage.price}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Package Details</Table.Cell>
                                        <Table.Cell>{(shootSession.id == 'self-shoot') ? packages(selfShootGuidelines) : packages(shootPackage.items)}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>
                <div style={{flexGrow: 1}}>
                    <Segment basic>  
                        <Form key={'form-1234213'} id='details-form' onSubmit={submitBooking}>
                            <Form.Group widths='equal' key={'form-group-1234'}>
                                <Form.Field
                                    id='form-input-control-first-name'
                                    key={'form-input-control-first-name-1'}
                                    control={Input}
                                    required={true}
                                    value={firstName}
                                    label='First name'
                                    placeholder='First name'
                                    onChange={(e)=>{
                                        setFirstName(e.target.value)
                                    }}
                                />
                                <Form.Field
                                    id='form-input-control-last-name'
                                    key={'form-input-control-last-name-1'}
                                    control={Input}
                                    required={true}
                                    label='Last name'
                                    placeholder='Last name'
                                    value={lastName}
                                    onChange={(e)=>{
                                        setLastName(e.target.value)
                                    }}
                                />
                            </Form.Group>
                            <Form.Field
                                id='form-textarea-control-opinion'
                                key={'form-input-control-text-area'}
                                control={TextArea}
                                label='Notes (Optional)'
                                placeholder='Notes'
                                value={notes}
                                onChange={(e)=>{
                                    setNotes(e.target.value)
                                }}
                            />
                            <Form.Field
                                id='form-input-control-error-email-1'
                                key='form-input-control-error-email-1'
                                required={true}
                                control={Input}
                                label='Email'
                                placeholder='john.doe@gmail.com'
                                value={email}
                                pattern={'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'}
                                onChange={(e)=>{
                                    setEmail(e.target.value)
                                }}
                            />
                            </Form>
                            
                            {submitResult && <Message
                                success
                                header='Your appointment reservation is completed.'
                                content='For questions and concerns please free to message us on our Facebook and Instagram. Thank you! '
                            />}
                    </Segment>
                </div>
            </div>
            <div style={{ marginTop: 20}}>
            <Button loading={submitLoading} disabled={(submitResult ? true : false)} form='details-form' type="submit" fluid color='brown' size='huge'>Submit</Button>
            </div></>
            }
        </Segment>
    </div>
)}