<?php
namespace Tests {
    include 'DoenetTestBase.php';
    class AssignmentTest extends DoenetTestBase {

        /**
         * @runInSeparateProcess
         */
        public function testCreateCourseItem() {
            $this->mockJsonBody([
                'courseId' => $this->course1,
                // TODO - review this
                // this is what the app code does, it passes the course Id for these
                // if there is no content in the course
                'previousContainingDoenetId' => $this->course1,
                'parentDoenetId' => $this->course1,
                'itemType' => 'activity'
            ]);
            
            $response = $this->runScriptExpectJson('public/api/createCourseItem.php');

            $this->assertTrue($response['success']);
            $this->assertEquals('Untitled Activity', $response['itemEntered']['label']);
            $this->assertEquals(1, $response['itemEntered']['isGloballyAssigned']);
            $this->assertEquals('0.1.0', $response['itemEntered']['version']);
            $this->assertEquals([1], $response['itemEntered']['itemWeights']);
            // TODO - review, asserts the behavior that we put courseId in a DoenetId field
            $this->assertEquals($this->course1, $response['itemEntered']['parentDoenetId']);
            $this->assertEquals('page', $response['pageEntered']['type']);
            $this->assertEquals('Untitled Page', $response['pageEntered']['label']);
            // Cid for a blank doc
            $this->assertEquals('bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku', $response['pageEntered']['cid']);
        }
    }
}
?>
