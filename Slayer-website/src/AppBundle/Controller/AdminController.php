<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AdminController extends Controller
{
    /**
     * @Route("/dev/mapgentest", name="mapgentest")
     */
    public function mapgentestAction(Request $request)
    {
        return $this->render('dev/mapgentest.html.twig', [
        ]);
    }

    /**
     * @Route("/dev/guitest", name="guitest")
     */
    public function guitestAction(Request $request)
    {
        return $this->render('dev/guitest.html.twig', [
        ]);
    }
}
