import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './companyProfiles_jobPostCategories_shortlistingCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('employers can successfully create and update company profiles', async () => {
  fetchMock.post('/api/company', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if profile creation fails', async () => {
  fetchMock.post('/api/company', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);

test('Assigning job posts to predefined categories successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Engineering' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Assigning job posts failure due to invalid category', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'InvalidCategory' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid category selected/i)).toBeInTheDocument();
}, 10000);

test('Employer can successfully shortlist a candidate.', async () => {
  fetchMock.post('/api/shortlist', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate shortlisted successfully')).toBeInTheDocument();
}, 10000);

test('Shortlisting a candidate fails due to server error.', async () => {
  fetchMock.post('/api/shortlist', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to shortlist the candidate')).toBeInTheDocument();
}, 10000);
