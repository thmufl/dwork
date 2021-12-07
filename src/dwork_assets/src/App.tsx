import React, { useState, useEffect } from 'react'

import { QueryClientProvider, QueryClient } from 'react-query'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import { dwork } from "../../declarations/dwork";

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Container className="app">
					<h1>DWORK APP</h1>
				</Container>
			</Router>
		</QueryClientProvider>
	)
}
export default App
