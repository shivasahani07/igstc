@isTest
private class ReviewerAllocationControllerTest {
    @isTest static void testGetSideBarOnLoadData() {
        Test.startTest();
        ReviewerAllocationController.SideBarDataWrapper result = ReviewerAllocationController.getSideBarOnLoadData();
        Test.stopTest();
        System.assertNotEquals(null, result, 'Result wrapper should not be null');
        System.assertNotEquals(null, result.sidebarItems, 'Sidebar items list should not be null');
    }
}