import React from 'react';
import { useLocation } from 'wouter';
import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer
} from '@chakra-ui/react';
import { ChevronDown, Package, Plus } from 'react-feather';
import headerLogo from './assets/logo.svg';
import { useSelector, useDispatch } from '../../reducer';
import { connectWallet } from '../../reducer/async/wallet';
import { disconnectWallet } from '../../reducer/async/wallet';
import { MinterButton /* , MinterLink */ } from '../common';

interface HeaderLinkProps {
  to: string;
  children: React.ReactNode;
}

function HeaderLink(props: HeaderLinkProps) {
  const [location, setLocation] = useLocation();
  const selected = location === props.to;
  return (
    <Link
      href={props.to}
      onClick={e => {
        e.preventDefault();
        setLocation(props.to);
      }}
      textDecor="none"
      borderRadius="10px"
      alignItems="center"
      fontWeight="600"
      //px={3}
      //py={2}
      mr={4}
      //bg={selected ? 'brand.blue' : 'white'}
      //color={selected ? 'white' : 'brand.blue'}
      display="flex"
      transition="none"
      _hover={{
        textDecor: 'none',
        //bg: 'gray.700',
        //color: selected ? 'gray.400' : 'gray.100'
      }}
    >
      {props.children}
    </Link>
  );
}

function WalletInfo(props: { tzPublicKey: string }) {
  return (
    <>
      <Box borderRadius="100%" width="50px" height="50px" bg="white" borderWidth="1px" borderColor="lightGray">
        <Image borderRadius="100%"
          src={`https://services.tzkt.io/v1/avatars2/${props.tzPublicKey}`}
        />
      </Box>
    </>
  );
}

function WalletDisplay() {
  const [, setLocation] = useLocation();
  const system = useSelector(s => s.system);
  const dispatch = useDispatch();
  if (system.status !== 'WalletConnected') {
    return (
      <>
      <Link>
          <MinterButton
            variant="secondaryActionLined"
            
            onClick={e => {
              e.preventDefault();
              dispatch(connectWallet());
            }}
          >
            <Text m={2} fontWeight="bold">Login</Text>
          </MinterButton>
      </Link>
    </>
    );
  }
  return (
    <>
      <Menu>
        <MenuButton>
          <WalletInfo tzPublicKey={system.tzPublicKey} />
        </MenuButton>
        <MenuList color="brand.black">
          <MenuItem>
            My Account
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await dispatch(disconnectWallet());
              setLocation('/collections');
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export function Header() {
  const [location, setLocation] = useLocation();
  /*if (location === '/' || location === '') {
    return null;
  }*/
  return (
    <Flex
      width="100%"
      bg="white"
      paddingX={10}
      paddingY={6}
      borderBottomColor="lightGray" 
      borderBottomWidth="1px"
    >
      <Image
        maxW="200px"
        src={headerLogo}
        onClick={e => {
          e.preventDefault();
          setLocation('/collections');
        }}
        cursor="pointer"
        align="right"
      />

      <Flex width="100%" alignSelf="right">
        
        <Spacer />
        
        <HeaderLink to="/marketplace">
          <Text m={2}>Marketplace</Text>
        </HeaderLink>

        <Menu>
          <MenuButton href="/about">
            <HeaderLink to="/about">
              <Text m={2}>About</Text>
            </HeaderLink>
          </MenuButton>
          
          <MenuList color="brand.black">
            <MenuItem align="center">
              <HeaderLink to="/about">
                <Text m={2}>About Us</Text>
              </HeaderLink>
            </MenuItem>
            
            <MenuItem>
              <HeaderLink to="/about">
                <Text m={2}>Our Model</Text>
              </HeaderLink>
            </MenuItem>
            
            <MenuItem>
              <HeaderLink to="/about">
                <Text m={2}>FAQ</Text>
              </HeaderLink>
            </MenuItem>
          </MenuList>
        </Menu>
       
        
        <HeaderLink to="/collections">
          <Text m={2}>My NFTs</Text>
        </HeaderLink>
        
        <HeaderLink to="/create">
          <Box color="brand.blue" mr="2" pl="2">
            <Plus size={30} strokeWidth="3" />
          </Box>
        </HeaderLink>
      
      </Flex>
      
      <Flex flex="1" alignSelf="right" color="brand.blue">
        <WalletDisplay />
      </Flex>
    
    </Flex>
  );
}

export default Header;
