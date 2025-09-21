import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addVaccinationRecord_addVetContactInformation_setCustomReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add vaccination record successfully.', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vaccination record due to missing vaccine name.', async () => {
  fetchMock.post('/api/vaccinations', 400);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccine name is required.')).toBeInTheDocument();
}, 10000);

test('Add vet contact information successfully.', async () => {
  fetchMock.post('/api/vets', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: 'Dr. Smith'}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet contact information added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vet contact information due to missing vet name.', async () => {
  fetchMock.post('/api/vets', 400);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet name is required.')).toBeInTheDocument();
}, 10000);

test('should set a new custom reminder successfully', async () => {
  fetchMock.post('/api/set-custom-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Custom Event/i), { target: { value: 'Birthday' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder set successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to set a new custom reminder', async () => {
  fetchMock.post('/api/set-custom-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Custom Event/i), { target: { value: 'Birthday' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to set reminder/i)).toBeInTheDocument();
}, 10000);
