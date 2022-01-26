import React, { useEffect, useState, useContext } from 'react'

import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
//import { Person, PersonFill } from 'react-bootstrap-icons'

//import ThemeChanger from './ThemeChanger'

const TopNav = (props: any) => {
	const { login, logout, isLoggedIn } = props

	return (
		<Navbar bg="dark" variant="dark" expand="md">
			<Container>
				<Navbar.Brand href="#home">dwork</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="#home">Home</Nav.Link>
						<Nav.Link href="#link">Link</Nav.Link>
						<NavDropdown title="Dropdown" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">
								Separated link
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
				<Nav>
					<Nav.Link onClick={!isLoggedIn() ? login : logout}>
						{!isLoggedIn() ? 'Login' : 'Logout'}
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	)
}
export default TopNav
