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

            print_r($response);
            $this->assertTrue($response['success']);
        }
    }
}
?>
