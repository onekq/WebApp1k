import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayPropertyInvestmentPotential_displayWalkabilityScore_propertyImageGallery';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Display property investment potential successfully', async () => {
  fetchMock.get('/api/investment-potential', { metrics: 'High' });

  await act(async () => { render(<MemoryRouter><InvestmentPotential /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('High')).toBeInTheDocument();
}, 10000);

test('Display property investment potential fails with error', async () => {
  fetchMock.get('/api/investment-potential', 500);

  await act(async () => { render(<MemoryRouter><InvestmentPotential /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying investment potential.')).toBeInTheDocument();
}, 10000);

test('Display walkability score successfully', async () => {
  fetchMock.get('/api/walkability-score', { score: 85 });

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('85')).toBeInTheDocument();
}, 10000);

test('Display walkability score fails with error', async () => {
  fetchMock.get('/api/walkability-score', 500);

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying walkability score.')).toBeInTheDocument();
}, 10000);

test('displays multiple images of a property in a gallery format', async () => {
  fetchMock.get('/property/1/images', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('imageGallery')).toBeInTheDocument();
}, 10000);

test('fails to display image gallery due to network error', async () => {
  fetchMock.get('/property/1/images', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load image gallery')).toBeInTheDocument();
}, 10000);
