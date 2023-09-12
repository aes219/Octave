import { Drawer, Menu } from "react-daisyui";

function Dashboard() {
    return(
        <>
        <Drawer>
        <div className="flex w-full p-4 items-center">
            <Menu>
                <Menu.Item className="bordered">
                    <a>Item 1</a>
                </Menu.Item>
                <Menu.Item className="hover-bordered">
                    <a>Item 2</a>
                </Menu.Item>
                <Menu.Item className="hover-bordered">
                    <a>Item 3</a>
                </Menu.Item>
            </Menu>
        </div>
        </Drawer>
        </>
    )
}

export default Dashboard