<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class GameController extends Controller
{
    /**
     * @Route("/game/client", name="game_client")
     */
    public function indexAction(Request $request)
    {
        return $this->render('game/client.html.twig', []);
    }
}
