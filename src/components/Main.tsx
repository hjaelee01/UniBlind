import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Post } from './Post';
import { useSelector } from 'react-redux';

export function Main() {
    const tabStyle = {
        margin: 'auto',
        width: '50%',
        padding: '10px'
    }
    const filterOptionBarStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    const posts = useSelector((state: {posts: {title: string, text: string}[]}) => state.posts)
    return (
        <div style={tabStyle}>
            <div style={filterOptionBarStyle}>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList>
                      <Tab style={{margin: '20px'}}>All</Tab>
                      <Tab style={{margin: '20px'}}>Hot🔥</Tab>
                      <Tab style={{margin: '20px'}}>New</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        Here comes post feed for 'All' 
                        {/* Wrap all the objects in the posts list inside Post component. */}
                        {posts.map((x: {title: string, text: string}) => <Post title={x.title} text={x.text} />)}
                      </TabPanel>
                      <TabPanel>
                        Here comes post feed for 'Hot🔥'
                        {/*<Post /> */}
                        {/*<Post /> */}
                      </TabPanel>
                      <TabPanel>
                        Here comes post feed for 'New'
                        {/*<Post /> */}
                        {/*<Post /> */}
                      </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    )
}